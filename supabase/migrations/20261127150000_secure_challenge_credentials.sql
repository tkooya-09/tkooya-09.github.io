-- Keep the existing public RPC signatures and SELECT * response shape.
-- The deployment supplies a separately generated bcrypt hash before COMMIT.
CREATE SCHEMA challenge_security;
REVOKE ALL ON SCHEMA challenge_security FROM PUBLIC, anon, authenticated;

CREATE TABLE challenge_security.admin_credentials (
  name text PRIMARY KEY,
  password_hash text NOT NULL CHECK (password_hash LIKE '$2a$12$%')
);
CREATE TABLE challenge_security.post_passwords (
  post_id bigint PRIMARY KEY REFERENCES public.challenge_posts(id) ON DELETE CASCADE,
  password_hash text NOT NULL
);
CREATE TABLE challenge_security.request_limits (
  scope text NOT NULL,
  subject text NOT NULL,
  started_at timestamptz NOT NULL,
  hits integer NOT NULL,
  PRIMARY KEY (scope, subject)
);
ALTER TABLE challenge_security.admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_security.post_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_security.request_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA challenge_security FROM PUBLIC, anon, authenticated;

INSERT INTO challenge_security.post_passwords(post_id,password_hash)
SELECT id,edit_pw_hash FROM public.challenge_posts WHERE edit_pw_hash IS NOT NULL;
UPDATE public.challenge_posts SET edit_pw_hash=NULL WHERE edit_pw_hash IS NOT NULL;
ALTER TABLE public.challenge_posts ADD CONSTRAINT challenge_public_hash_always_null CHECK (edit_pw_hash IS NULL);

CREATE FUNCTION challenge_security.allow_request(p_scope text,p_limit integer)
RETURNS boolean LANGUAGE plpgsql SET search_path='' AS $$
DECLARE n integer;
BEGIN
  -- A server-owned global budget cannot be evaded by changing visitor IDs.
  INSERT INTO challenge_security.request_limits AS r(scope,subject,started_at,hits)
  VALUES(p_scope,'global',clock_timestamp(),1)
  ON CONFLICT(scope,subject) DO UPDATE SET
    hits=CASE WHEN r.started_at<=clock_timestamp()-interval '1 minute' THEN 1 ELSE least(r.hits+1,p_limit+1) END,
    started_at=CASE WHEN r.started_at<=clock_timestamp()-interval '1 minute' THEN clock_timestamp() ELSE r.started_at END
  RETURNING hits INTO n;
  RETURN n<=p_limit;
END;
$$;
CREATE FUNCTION challenge_security.is_admin(p_password text)
RETURNS boolean LANGUAGE plpgsql SET search_path='' AS $$
DECLARE h text;
BEGIN
  IF p_password IS NULL OR octet_length(p_password)>72 OR length(p_password)<20 THEN RETURN false; END IF;
  SELECT password_hash INTO h FROM challenge_security.admin_credentials WHERE name='primary';
  RETURN h IS NOT NULL AND extensions.crypt(p_password,h)=h;
END;
$$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA challenge_security FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.verify_challenge_admin(_pw text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF NOT challenge_security.allow_request('admin_verify',30) THEN RETURN false; END IF;
  RETURN challenge_security.is_admin(_pw);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_challenge_post(_author text,_org text,_title text,_content text,_file_url text,_file_name text,_category text,_pw text)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE new_id bigint;
BEGIN
  IF coalesce(btrim(_author),'')='' OR coalesce(btrim(_title),'')='' THEN
    RAISE EXCEPTION '이름과 제목은 필수입니다.';
  END IF;
  IF octet_length(coalesce(_pw,''))>72 THEN RAISE EXCEPTION '비밀번호는 72바이트 이내로 입력해 주세요.'; END IF;
  IF NOT challenge_security.allow_request('post_create',120) THEN RAISE EXCEPTION '잠시 후 다시 시도해 주세요.'; END IF;
  INSERT INTO public.challenge_posts(author,org,title,content,file_url,file_name,category)
  VALUES(btrim(_author),nullif(btrim(_org),''),btrim(_title),nullif(_content,''),_file_url,_file_name,coalesce(nullif(btrim(_category),''),'질문'))
  RETURNING id INTO new_id;
  IF coalesce(_pw,'')<>'' THEN
    INSERT INTO challenge_security.post_passwords(post_id,password_hash)
    VALUES(new_id,extensions.crypt(_pw,extensions.gen_salt('bf',10)));
  END IF;
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_challenge_post(_id bigint,_pw text,_title text,_content text,_category text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE h text; allowed boolean; n integer;
BEGIN
  IF _pw IS NULL OR _pw='' OR octet_length(_pw)>72 THEN RETURN false; END IF;
  IF NOT challenge_security.allow_request('post_mutate',60) THEN RETURN false; END IF;
  SELECT password_hash INTO h FROM challenge_security.post_passwords WHERE post_id=_id;
  allowed:=coalesce(h IS NOT NULL AND extensions.crypt(_pw,h)=h,false);
  IF NOT allowed THEN allowed:=challenge_security.is_admin(_pw); END IF;
  IF NOT allowed THEN RETURN false; END IF;
  UPDATE public.challenge_posts SET title=coalesce(nullif(btrim(_title),''),title),content=nullif(_content,''),category=coalesce(nullif(btrim(_category),''),category) WHERE id=_id;
  GET DIAGNOSTICS n=ROW_COUNT;
  RETURN n>0;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_challenge_post(_id bigint,_pw text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE h text; allowed boolean; n integer;
BEGIN
  IF _pw IS NULL OR _pw='' OR octet_length(_pw)>72 THEN RETURN false; END IF;
  IF NOT challenge_security.allow_request('post_mutate',60) THEN RETURN false; END IF;
  SELECT password_hash INTO h FROM challenge_security.post_passwords WHERE post_id=_id;
  allowed:=coalesce(h IS NOT NULL AND extensions.crypt(_pw,h)=h,false);
  IF NOT allowed THEN allowed:=challenge_security.is_admin(_pw); END IF;
  IF NOT allowed THEN RETURN false; END IF;
  DELETE FROM public.challenge_posts WHERE id=_id;
  GET DIAGNOSTICS n=ROW_COUNT;
  RETURN n>0;
END;
$$;

-- PUBLIC does not need blanket access; the existing anonymous API stays usable.
REVOKE ALL ON FUNCTION public.verify_challenge_admin(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_challenge_post(text,text,text,text,text,text,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_challenge_post(bigint,text,text,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_challenge_post(bigint,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_challenge_admin(text),public.create_challenge_post(text,text,text,text,text,text,text,text),public.update_challenge_post(bigint,text,text,text,text),public.delete_challenge_post(bigint,text) TO anon,authenticated,service_role;

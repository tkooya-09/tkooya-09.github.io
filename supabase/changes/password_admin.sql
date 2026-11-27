-- The owner-selected password is provisioned as a bcrypt hash outside source control.
CREATE TABLE challenge_security.password_sessions (
 token_hash text PRIMARY KEY, principal uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE challenge_security.password_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON challenge_security.password_sessions FROM PUBLIC,anon,authenticated;
ALTER TABLE challenge_security.admin_credentials ADD COLUMN principal uuid NOT NULL DEFAULT gen_random_uuid();

-- Password checks have rolling global budgets; failed attempts persist their counters.
CREATE FUNCTION public.studio_password_login(password text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE h text; owner_id uuid; token text;
BEGIN
 IF password IS NULL OR octet_length(password)>72 OR length(password)<1 THEN RETURN jsonb_build_object('error','invalid_credentials'); END IF;
 IF NOT studio_visitors.allow_rate('admin:login:minute',5,60) OR NOT studio_visitors.allow_rate('admin:login:hour',30,3600) THEN
  RETURN jsonb_build_object('error','rate_limited');
 END IF;
 SELECT password_hash,principal INTO h,owner_id FROM challenge_security.admin_credentials WHERE name='primary';
 IF h IS NULL OR extensions.crypt(password,h)<>h THEN RETURN jsonb_build_object('error','invalid_credentials'); END IF;
 DELETE FROM challenge_security.password_sessions WHERE created_at<now()-interval '30 minutes' OR last_seen_at<now()-interval '10 minutes';
 token:=encode(extensions.gen_random_bytes(32),'hex');
 INSERT INTO challenge_security.password_sessions(token_hash,principal) VALUES(encode(extensions.digest(token,'sha256'),'hex'),owner_id);
 RETURN jsonb_build_object('access_token',token,'expires_in',1800);
END;
$$;
CREATE FUNCTION public.studio_password_admin(session_token text,action text,target text DEFAULT NULL,record_id bigint DEFAULT NULL,hide boolean DEFAULT NULL,new_title text DEFAULT NULL,new_content text DEFAULT NULL,new_category text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE owner_id uuid; token_digest text; affected integer;
BEGIN
 IF session_token IS NULL OR session_token !~ '^[a-f0-9]{64}$' THEN RETURN jsonb_build_object('error','forbidden'); END IF;
 token_digest:=encode(extensions.digest(session_token,'sha256'),'hex');
 -- Lock the session across authorization and mutation, including concurrent logout.
 SELECT principal INTO owner_id FROM challenge_security.password_sessions
 WHERE token_hash=token_digest AND created_at>now()-interval '30 minutes' AND last_seen_at>now()-interval '10 minutes' FOR UPDATE;
 IF owner_id IS NULL THEN RETURN jsonb_build_object('error','forbidden'); END IF;
 IF action='logout' THEN
  DELETE FROM challenge_security.password_sessions WHERE token_hash=token_digest;
  RETURN jsonb_build_object('ok',true);
 END IF;
 IF action IS NULL OR action NOT IN ('read','moderate','edit') THEN RETURN jsonb_build_object('error','invalid_request'); END IF;
 UPDATE challenge_security.password_sessions SET last_seen_at=now() WHERE token_hash=token_digest;
 IF action='read' THEN
  RETURN jsonb_build_object(
   'notes',coalesce((SELECT jsonb_agg(to_jsonb(n) ORDER BY created DESC) FROM
    (SELECT id::text,name,message,created,hidden_at FROM studio_visitors.notes ORDER BY id DESC LIMIT 100)n),'[]'::jsonb),
   'posts',coalesce((SELECT jsonb_agg(to_jsonb(p) ORDER BY created_at DESC) FROM
    (SELECT id::text,author,title,content,category,created_at,hidden_at FROM public.challenge_posts ORDER BY id DESC LIMIT 100)p),'[]'::jsonb));
 END IF;
 IF NOT challenge_security.allow_request('password_admin_actions',60) THEN RETURN jsonb_build_object('error','rate_limited'); END IF;
 IF action='moderate' THEN
  IF target IS NULL OR target NOT IN ('note','post') OR hide IS NULL OR record_id IS NULL THEN RETURN jsonb_build_object('error','invalid_request'); END IF;
  IF target='note' THEN
   UPDATE studio_visitors.notes SET hidden_at=CASE WHEN hide THEN now() ELSE NULL END WHERE id=record_id;
  ELSE
   UPDATE public.challenge_posts SET hidden_at=CASE WHEN hide THEN now() ELSE NULL END WHERE id=record_id;
  END IF;
 ELSE
  IF new_title IS NULL OR length(trim(new_title)) NOT BETWEEN 1 AND 200 OR length(coalesce(new_content,''))>20000 OR length(coalesce(new_category,''))>40 THEN RETURN jsonb_build_object('error','invalid_request'); END IF;
  UPDATE public.challenge_posts SET title=trim(new_title),content=coalesce(new_content,''),category=coalesce(nullif(trim(new_category),''),'질문') WHERE id=record_id;
 END IF;
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected=0 THEN RETURN jsonb_build_object('error','not_found'); END IF;
 INSERT INTO challenge_security.admin_events(user_id,action,target,target_id) VALUES(owner_id,CASE WHEN action='edit' THEN 'edit' WHEN hide THEN 'hide' ELSE 'restore' END,CASE WHEN action='edit' THEN 'post' ELSE target END,record_id);
 RETURN jsonb_build_object('ok',true);
END;
$$;
REVOKE ALL ON FUNCTION public.studio_password_login(text),public.studio_password_admin(text,text,text,bigint,boolean,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.studio_password_login(text),public.studio_password_admin(text,text,text,bigint,boolean,text,text,text) TO anon,authenticated;
-- Close every superseded mutation/auth path. Public reads and new submissions remain.
REVOKE ALL ON FUNCTION public.update_challenge_post(bigint,text,text,text,text),public.delete_challenge_post(bigint,text),public.verify_challenge_admin(text),public.studio_claim_admin(text),public.studio_admin_status(),public.studio_admin_dashboard(),public.studio_admin_moderate(text,bigint,boolean),public.studio_admin_edit_post(bigint,text,text,text) FROM PUBLIC,anon,authenticated;
UPDATE challenge_security.bootstrap_state SET completed_at=coalesce(completed_at,now()) WHERE singleton;

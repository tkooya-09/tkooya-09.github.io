-- Apply through Supabase apply_migration. No credentials belong in this file.
CREATE TABLE challenge_security.admin_members (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 enabled boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE challenge_security.admin_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id uuid NOT NULL,
 action text NOT NULL, target text NOT NULL, target_id bigint, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE challenge_security.bootstrap_state (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton), completed_at timestamptz
);
INSERT INTO challenge_security.bootstrap_state(singleton) VALUES(true);
ALTER TABLE challenge_security.admin_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_security.admin_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_security.bootstrap_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA challenge_security FROM PUBLIC,anon,authenticated;
ALTER TABLE studio_visitors.notes ADD COLUMN hidden_at timestamptz;
ALTER TABLE public.challenge_posts ADD COLUMN hidden_at timestamptz;
ALTER POLICY challenge_read_all ON public.challenge_posts USING (hidden_at IS NULL);

CREATE FUNCTION challenge_security.valid_session()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT auth.uid() IS NOT NULL AND EXISTS(
  SELECT 1 FROM auth.sessions s JOIN auth.users u ON u.id=s.user_id
  WHERE s.id::text=auth.jwt()->>'session_id' AND s.user_id=auth.uid()
   AND s.created_at>now()-interval '30 minutes'
   AND (s.not_after IS NULL OR s.not_after>now())
   AND u.email_confirmed_at IS NOT NULL AND NOT u.is_anonymous
   AND u.deleted_at IS NULL AND (u.banned_until IS NULL OR u.banned_until<now())
 );
$$;
CREATE FUNCTION challenge_security.logged_in_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT challenge_security.valid_session() AND EXISTS(
  SELECT 1 FROM challenge_security.admin_members WHERE user_id=auth.uid() AND enabled
 );
$$;
REVOKE ALL ON FUNCTION challenge_security.valid_session(),challenge_security.logged_in_admin() FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.studio_admin_status()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT challenge_security.valid_session() THEN RETURN jsonb_build_object('error','session_expired'); END IF;
 RETURN jsonb_build_object('admin',challenge_security.logged_in_admin(),'setup_available',
  EXISTS(SELECT 1 FROM challenge_security.bootstrap_state WHERE completed_at IS NULL));
END;
$$;
CREATE FUNCTION public.studio_claim_admin(bootstrap_password text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT challenge_security.valid_session() THEN RETURN jsonb_build_object('error','session_expired'); END IF;
 PERFORM 1 FROM challenge_security.bootstrap_state WHERE singleton FOR UPDATE;
 IF EXISTS(SELECT 1 FROM challenge_security.bootstrap_state WHERE completed_at IS NOT NULL) THEN
  RETURN jsonb_build_object('error','setup_closed');
 END IF;
 IF NOT challenge_security.allow_request('owner_claim',5) THEN RETURN jsonb_build_object('error','rate_limited'); END IF;
 IF NOT challenge_security.is_admin(bootstrap_password) THEN RETURN jsonb_build_object('error','invalid_credentials'); END IF;
 INSERT INTO challenge_security.admin_members(user_id) VALUES(auth.uid());
 UPDATE challenge_security.bootstrap_state SET completed_at=now() WHERE singleton;
 INSERT INTO challenge_security.admin_events(user_id,action,target) VALUES(auth.uid(),'owner_registered','account');
 DELETE FROM challenge_security.admin_credentials WHERE name='primary';
 RETURN jsonb_build_object('ok',true);
END;
$$;
CREATE FUNCTION public.studio_admin_dashboard()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT challenge_security.logged_in_admin() THEN RETURN jsonb_build_object('error','forbidden'); END IF;
 RETURN jsonb_build_object(
  'notes',coalesce((SELECT jsonb_agg(to_jsonb(n) ORDER BY created DESC) FROM
   (SELECT id::text,name,message,created,hidden_at FROM studio_visitors.notes ORDER BY id DESC LIMIT 100)n),'[]'::jsonb),
  'posts',coalesce((SELECT jsonb_agg(to_jsonb(p) ORDER BY created_at DESC) FROM
   (SELECT id::text,author,title,content,category,created_at,hidden_at FROM public.challenge_posts ORDER BY id DESC LIMIT 100)p),'[]'::jsonb)
 );
END;
$$;
CREATE FUNCTION public.studio_admin_moderate(target text,record_id bigint,hide boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE n integer;
BEGIN
 IF NOT challenge_security.logged_in_admin() THEN RETURN jsonb_build_object('error','forbidden'); END IF;
 IF target IS NULL OR target NOT IN ('note','post') OR hide IS NULL OR record_id IS NULL THEN RETURN jsonb_build_object('error','invalid_request'); END IF;
 IF NOT challenge_security.allow_request('admin_actions',60) THEN RETURN jsonb_build_object('error','rate_limited'); END IF;
 IF target='note' THEN
  UPDATE studio_visitors.notes SET hidden_at=CASE WHEN hide THEN now() ELSE NULL END WHERE id=record_id;
 ELSE
  UPDATE public.challenge_posts SET hidden_at=CASE WHEN hide THEN now() ELSE NULL END WHERE id=record_id;
 END IF;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n=0 THEN RETURN jsonb_build_object('error','not_found'); END IF;
 INSERT INTO challenge_security.admin_events(user_id,action,target,target_id) VALUES(auth.uid(),CASE WHEN hide THEN 'hide' ELSE 'restore' END,target,record_id);
 RETURN jsonb_build_object('ok',true);
END;
$$;
CREATE FUNCTION public.studio_admin_edit_post(record_id bigint,new_title text,new_content text,new_category text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE n integer;
BEGIN
 IF NOT challenge_security.logged_in_admin() THEN RETURN jsonb_build_object('error','forbidden'); END IF;
 IF new_title IS NULL OR length(trim(new_title)) NOT BETWEEN 1 AND 200 OR length(coalesce(new_content,''))>20000 OR length(coalesce(new_category,''))>40 THEN RETURN jsonb_build_object('error','invalid_request'); END IF;
 IF NOT challenge_security.allow_request('admin_actions',60) THEN RETURN jsonb_build_object('error','rate_limited'); END IF;
 UPDATE public.challenge_posts SET title=trim(new_title),content=coalesce(new_content,''),category=coalesce(nullif(trim(new_category),''),'질문') WHERE id=record_id;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n=0 THEN RETURN jsonb_build_object('error','not_found'); END IF;
 INSERT INTO challenge_security.admin_events(user_id,action,target,target_id) VALUES(auth.uid(),'edit','post',record_id);
 RETURN jsonb_build_object('ok',true);
END;
$$;
REVOKE ALL ON FUNCTION public.studio_admin_status(),public.studio_claim_admin(text),public.studio_admin_dashboard(),public.studio_admin_moderate(text,bigint,boolean),public.studio_admin_edit_post(bigint,text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.studio_admin_status(),public.studio_claim_admin(text),public.studio_admin_dashboard(),public.studio_admin_moderate(text,bigint,boolean),public.studio_admin_edit_post(bigint,text,text,text) TO authenticated;
CREATE OR REPLACE FUNCTION studio_visitors.snapshot()
RETURNS jsonb LANGUAGE sql SET search_path='' AS $$
 SELECT jsonb_build_object(
 'today',coalesce((select total from studio_visitors.daily_counts where day=(now() at time zone 'Asia/Seoul')::date),0),
 'total',coalesce((select sum(total) from studio_visitors.daily_counts),0),
 'notes',coalesce((select jsonb_agg(to_jsonb(n) order by n.id desc) from
 (select id,name,message,created from studio_visitors.notes where hidden_at IS NULL order by id desc limit 30)n),'[]'::jsonb));
$$;

-- Run only inside BEGIN/ROLLBACK, after the admin_login change in the same transaction.
DO $test$
DECLARE owner_id uuid:=gen_random_uuid(); other_id uuid:=gen_random_uuid(); sid uuid:=gen_random_uuid(); other_sid uuid:=gen_random_uuid(); post_id bigint; note_id bigint; r jsonb; test_pw text:='test-only-admin-password-with-entropy';
BEGIN
 INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at) VALUES(owner_id,'authenticated','authenticated','owner-test@example.invalid',now(),now(),now()),(other_id,'authenticated','authenticated','other-test@example.invalid',now(),now(),now());
 INSERT INTO auth.sessions(id,user_id,created_at,updated_at) VALUES(sid,owner_id,now(),now()),(other_sid,other_id,now(),now());
 UPDATE challenge_security.admin_credentials SET password_hash=extensions.crypt(test_pw,extensions.gen_salt('bf',12)) WHERE name='primary';
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',owner_id,'session_id',sid,'role','authenticated')::text,true);
 ASSERT (public.studio_admin_dashboard()->>'error')='forbidden','unregistered user must be denied';
 ASSERT (public.studio_claim_admin('wrong')->>'error')='invalid_credentials','wrong bootstrap must fail';
 ASSERT (public.studio_claim_admin(test_pw)->>'ok')::boolean,'owner claim failed';
 ASSERT NOT challenge_security.is_admin(test_pw),'old password still valid';
 ASSERT (public.studio_claim_admin(test_pw)->>'error')='setup_closed','claim must be one time';
 post_id:=public.create_challenge_post('security-test','','rollback post','test content','','','질문','author-test-password');
 INSERT INTO studio_visitors.notes(token,name,message) VALUES(gen_random_uuid(),'security-test','rollback only') RETURNING id INTO note_id;
 ASSERT (public.studio_admin_moderate('post',post_id,true)->>'ok')::boolean,'hide post failed';
 ASSERT (public.studio_admin_moderate('note',note_id,true)->>'ok')::boolean,'hide note failed';
 ASSERT NOT EXISTS(SELECT 1 FROM jsonb_array_elements(studio_visitors.snapshot()->'notes') n WHERE (n->>'id')::bigint=note_id),'hidden note leaked';
 ASSERT (public.studio_admin_dashboard()->'posts') IS NOT NULL,'owner list failed';
 ASSERT (public.studio_admin_edit_post(post_id,'edited','changed','후기')->>'ok')::boolean,'edit failed';
 ASSERT (public.studio_admin_moderate('post',post_id,false)->>'ok')::boolean,'restore failed';
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',other_id,'session_id',other_sid,'role','authenticated','user_metadata',jsonb_build_object('admin',true))::text,true);
 ASSERT (public.studio_admin_dashboard()->>'error')='forbidden','unprivileged user/metadata bypass';
 ASSERT (public.studio_admin_moderate('post',post_id,true)->>'error')='forbidden','non-admin moderation';
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',owner_id,'session_id',sid,'role','authenticated')::text,true);
 UPDATE challenge_security.admin_members SET enabled=false WHERE user_id=owner_id;
 ASSERT (public.studio_admin_dashboard()->>'error')='forbidden','revoked membership accepted';
 UPDATE challenge_security.admin_members SET enabled=true WHERE user_id=owner_id;
 UPDATE auth.sessions SET created_at=now()-interval '31 minutes' WHERE id=sid;
 ASSERT (public.studio_admin_dashboard()->>'error')='forbidden','expired session accepted';
 UPDATE auth.sessions SET created_at=now() WHERE id=sid;
 DELETE FROM auth.sessions WHERE id=sid;
 ASSERT (public.studio_admin_dashboard()->>'error')='forbidden','logged-out session accepted';
 ASSERT NOT has_function_privilege('anon','public.studio_admin_dashboard()','EXECUTE'),'anon RPC privilege';
 ASSERT NOT has_schema_privilege('authenticated','challenge_security','USAGE'),'private schema accessible';
END;
$test$;

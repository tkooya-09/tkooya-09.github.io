-- Run after password_admin.sql inside BEGIN/ROLLBACK; no production password is used.
DO $test$
DECLARE token text; note_id bigint; post_id bigint; i integer; r jsonb; fake text:=repeat('0',64);
BEGIN
 UPDATE challenge_security.admin_credentials SET password_hash=extensions.crypt('test-only-owner-password',extensions.gen_salt('bf',12)) WHERE name='primary';
 DELETE FROM studio_visitors.rate_limits WHERE bucket LIKE 'admin:login:%';
 ASSERT (public.studio_password_login('incorrect')->>'error')='invalid_credentials','wrong password accepted';
 token:=public.studio_password_login('test-only-owner-password')->>'access_token';
 ASSERT token ~ '^[a-f0-9]{64}$','random token absent';
 ASSERT NOT EXISTS(SELECT 1 FROM challenge_security.password_sessions WHERE token_hash=token),'plaintext token stored';
 ASSERT (public.studio_password_admin(fake,'read')->>'error')='forbidden','forged token accepted';
 INSERT INTO public.challenge_posts(author,title) VALUES('rollback-only','rollback-only') RETURNING id INTO post_id;
 INSERT INTO studio_visitors.notes(token,name,message) VALUES(gen_random_uuid(),'rollback','rollback-only') RETURNING id INTO note_id;
 ASSERT (public.studio_password_admin(token,'edit','post',post_id,NULL,'updated','updated','질문')->>'ok')::boolean,'admin edit failed';
 ASSERT (public.studio_password_admin(token,'moderate','note',note_id,true)->>'ok')::boolean,'admin hide failed';
 ASSERT NOT EXISTS(SELECT 1 FROM jsonb_array_elements(studio_visitors.snapshot()->'notes') n WHERE (n->>'id')::bigint=note_id),'hidden note visible';
 ASSERT (public.studio_password_admin(token,'moderate','note',note_id,false)->>'ok')::boolean,'restore failed';
 ASSERT NOT has_function_privilege('anon','public.update_challenge_post(bigint,text,text,text,text)','EXECUTE'),'old author update open';
 ASSERT NOT has_function_privilege('authenticated','public.delete_challenge_post(bigint,text)','EXECUTE'),'old author delete open';
 ASSERT NOT has_function_privilege('authenticated','public.studio_claim_admin(text)','EXECUTE'),'bootstrap still open';
 ASSERT (public.studio_password_admin(token,'read')->'posts') IS NOT NULL,'admin dashboard unavailable';
 UPDATE challenge_security.password_sessions SET last_seen_at=now()-interval '11 minutes';
 ASSERT (public.studio_password_admin(token,'read')->>'error')='forbidden','idle timeout missing';
 UPDATE challenge_security.password_sessions SET last_seen_at=now(),created_at=now()-interval '31 minutes';
 ASSERT (public.studio_password_admin(token,'read')->>'error')='forbidden','absolute timeout missing';
 UPDATE challenge_security.password_sessions SET created_at=now(),last_seen_at=now();
 ASSERT (public.studio_password_admin(token,'logout')->>'ok')::boolean,'logout failed';
 ASSERT (public.studio_password_admin(token,'read')->>'error')='forbidden','logged-out token accepted';
 FOR i IN 1..6 LOOP r:=public.studio_password_login('incorrect'); END LOOP;
 ASSERT r->>'error'='rate_limited','password guessing not limited';
END;
$test$;

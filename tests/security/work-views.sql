-- Rollback-based verification: no test counts or messages survive.
BEGIN;
SET LOCAL ROLE service_role;
DO $$
DECLARE visitor_id uuid:=gen_random_uuid(); actor_id text:=repeat('a',64);
 baseline bigint; response jsonb; visits_before bigint;
BEGIN
 SELECT total INTO baseline FROM studio_visitors.work_totals WHERE work_id='contract';
 SELECT (studio_visitors.snapshot()->>'total')::bigint INTO visits_before;
 response:=public.studio_work_view_secure(actor_id,visitor_id,'contract');
 IF response ? 'error' OR (response->'views'->>'contract')::bigint<>baseline+1 THEN RAISE EXCEPTION 'First view failed'; END IF;
 response:=public.studio_work_view_secure(actor_id,visitor_id,'contract');
 IF (response->'views'->>'contract')::bigint<>baseline+1 THEN RAISE EXCEPTION 'Duplicate view counted'; END IF;
 response:=public.studio_work_view_secure(actor_id,gen_random_uuid(),'contract');
 IF (response->'views'->>'contract')::bigint<>baseline+2 THEN RAISE EXCEPTION 'Second visitor did not count'; END IF;
 response:=public.studio_work_view_secure(actor_id,visitor_id,'unregistered-work');
 IF response->>'error' IS DISTINCT FROM 'invalid_request' THEN RAISE EXCEPTION 'Unknown work accepted'; END IF;
 IF (studio_visitors.snapshot()->>'total')::bigint<>visits_before THEN RAISE EXCEPTION 'Work views changed site visits'; END IF;
 response:=public.studio_guest_activity_secure('visit',actor_id,visitor_id);
 response:=public.studio_guest_activity_secure('visit',actor_id,visitor_id);
 IF (response->>'total')::bigint<>visits_before+1 THEN RAISE EXCEPTION 'Site visit deduplication failed'; END IF;
END $$;
ROLLBACK;

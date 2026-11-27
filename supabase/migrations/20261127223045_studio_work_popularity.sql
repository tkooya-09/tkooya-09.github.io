-- Public UI receives aggregates only; raw daily tokens remain private.
CREATE TABLE studio_visitors.work_totals (
 work_id text PRIMARY KEY,
 total bigint NOT NULL DEFAULT 0 CHECK(total >= 0)
);
CREATE TABLE studio_visitors.work_daily_views (
 day date NOT NULL,
 work_id text NOT NULL REFERENCES studio_visitors.work_totals(work_id),
 token uuid NOT NULL,
 PRIMARY KEY(day,work_id,token)
);
ALTER TABLE studio_visitors.work_totals ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_visitors.work_daily_views ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON studio_visitors.work_totals,studio_visitors.work_daily_views FROM PUBLIC,anon,authenticated;
GRANT ALL ON studio_visitors.work_totals,studio_visitors.work_daily_views TO service_role;
INSERT INTO studio_visitors.work_totals(work_id) VALUES
('contract'),
('personal'),
('explore'),
('tobacco'),
('duty'),
('judging'),
('data'),
('color'),
('data-gs'),
('data-hs'),
('webtoon'),
('sia'),
('frontier'),
('video'),
('just-you'),
('as-you-think'),
('merry-merry-christmas'),
('overflowing'),
('ganadara'),
('grow'),
('thank-you'),
('life'),
('what-is-life');

CREATE OR REPLACE FUNCTION studio_visitors.snapshot()
RETURNS jsonb LANGUAGE sql SET search_path='' AS $$
 SELECT jsonb_build_object(
 'today',coalesce((select total from studio_visitors.daily_counts where day=(now() at time zone 'Asia/Seoul')::date),0),
 'total',coalesce((select sum(total) from studio_visitors.daily_counts),0),
 'views',coalesce((select jsonb_object_agg(work_id,total) from studio_visitors.work_totals),'{}'::jsonb),
 'notes',coalesce((select jsonb_agg(to_jsonb(n) order by n.id desc) from
 (select id,name,message,created from studio_visitors.notes where hidden_at IS NULL order by id desc limit 30)n),'[]'::jsonb));
$$;
REVOKE ALL ON FUNCTION studio_visitors.snapshot() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION studio_visitors.snapshot() TO service_role;

CREATE FUNCTION public.studio_work_view_secure(actor text,visitor uuid,work text)
RETURNS jsonb LANGUAGE plpgsql SET search_path='' AS $$
DECLARE d date:=(now() at time zone 'Asia/Seoul')::date; added integer;
BEGIN
 IF actor IS NULL OR actor !~ '^[0-9a-f]{64}$' OR visitor IS NULL OR work IS NULL
    OR NOT EXISTS(SELECT 1 FROM studio_visitors.work_totals WHERE work_id=work) THEN
  RETURN jsonb_build_object('error','invalid_request');
 END IF;
 -- Same lock as the existing visitor/guestbook flow: rate checks and counts are atomic.
 PERFORM pg_advisory_xact_lock(723541992);
 IF NOT studio_visitors.allow_rate('global:requests',600,60)
    OR NOT studio_visitors.allow_rate('peer:requests:'||actor,60,60) THEN
  RETURN jsonb_build_object('error','rate_limited','retry_after',60);
 END IF;
 IF NOT EXISTS(SELECT 1 FROM studio_visitors.work_daily_views WHERE day=d AND work_id=work AND token=visitor) THEN
  IF NOT studio_visitors.allow_rate('global:new-work-views:'||d,20000,86400)
     OR NOT studio_visitors.allow_rate('peer:new-work-views:'||d||':'||actor,200,86400) THEN
   RETURN jsonb_build_object('error','rate_limited','retry_after',3600);
  END IF;
  INSERT INTO studio_visitors.work_daily_views(day,work_id,token) VALUES(d,work,visitor) ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS added=ROW_COUNT;
  IF added=1 THEN UPDATE studio_visitors.work_totals SET total=total+1 WHERE work_id=work; END IF;
 END IF;
 -- Daily deduplication needs only the current day; lifetime aggregates are retained.
 DELETE FROM studio_visitors.work_daily_views WHERE day<d-1;
 DELETE FROM studio_visitors.rate_limits WHERE started_at<now()-interval '2 days';
 RETURN studio_visitors.snapshot();
END;
$$;
REVOKE ALL ON FUNCTION public.studio_work_view_secure(text,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.studio_work_view_secure(text,uuid,text) TO service_role;

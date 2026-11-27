CREATE TABLE studio_visitors.rate_limits (
  bucket text PRIMARY KEY,
  started_at timestamptz NOT NULL,
  hits integer NOT NULL
);
CREATE INDEX studio_rate_limits_expiry ON studio_visitors.rate_limits(started_at);
CREATE TABLE studio_visitors.daily_counts(day date PRIMARY KEY,total bigint NOT NULL DEFAULT 0);
INSERT INTO studio_visitors.daily_counts SELECT day,count(*) FROM studio_visitors.visits GROUP BY day;
ALTER TABLE studio_visitors.notes ADD COLUMN actor_hash text;
CREATE INDEX studio_notes_actor_created ON studio_visitors.notes(actor_hash,created DESC);
ALTER TABLE studio_visitors.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_visitors.daily_counts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON studio_visitors.rate_limits,studio_visitors.daily_counts FROM PUBLIC,anon,authenticated;
GRANT ALL ON studio_visitors.rate_limits,studio_visitors.daily_counts TO service_role;

CREATE FUNCTION studio_visitors.allow_rate(p_bucket text,p_limit integer,p_seconds integer)
RETURNS boolean LANGUAGE plpgsql SET search_path='' AS $$
DECLARE n integer;
BEGIN
 INSERT INTO studio_visitors.rate_limits AS r(bucket,started_at,hits) VALUES(p_bucket,clock_timestamp(),1)
 ON CONFLICT(bucket) DO UPDATE SET
 hits=CASE WHEN r.started_at<=clock_timestamp()-make_interval(secs=>p_seconds) THEN 1 ELSE least(r.hits+1,p_limit+1) END,
 started_at=CASE WHEN r.started_at<=clock_timestamp()-make_interval(secs=>p_seconds) THEN clock_timestamp() ELSE r.started_at END
 RETURNING hits INTO n;
 RETURN n<=p_limit;
END;
$$;
CREATE FUNCTION studio_visitors.snapshot()
RETURNS jsonb LANGUAGE sql SET search_path='' AS $$
 SELECT jsonb_build_object(
 'today',coalesce((select total from studio_visitors.daily_counts where day=(now() at time zone 'Asia/Seoul')::date),0),
 'total',coalesce((select sum(total) from studio_visitors.daily_counts),0),
 'notes',coalesce((select jsonb_agg(to_jsonb(n) order by n.id desc) from
 (select id,name,message,created from studio_visitors.notes order by id desc limit 30)n),'[]'::jsonb));
$$;
REVOKE ALL ON FUNCTION studio_visitors.allow_rate(text,integer,integer),studio_visitors.snapshot() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION studio_visitors.allow_rate(text,integer,integer),studio_visitors.snapshot() TO service_role;

CREATE FUNCTION public.studio_guest_activity_secure(action text,actor text,visitor uuid DEFAULT NULL,nickname text DEFAULT NULL,note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SET search_path='' AS $$
DECLARE d date:=(now() at time zone 'Asia/Seoul')::date; added integer;
BEGIN
 IF actor IS NULL OR actor !~ '^[0-9a-f]{64}$' OR action IS NULL OR action NOT IN ('read','visit','post') THEN
  RETURN jsonb_build_object('error','invalid_request');
 END IF;
 IF action IN ('visit','post') AND visitor IS NULL THEN RETURN jsonb_build_object('error','invalid_request'); END IF;
 IF action='post' AND (nickname IS NULL OR note IS NULL OR length(trim(nickname)) NOT BETWEEN 1 AND 16 OR length(trim(note)) NOT BETWEEN 1 AND 160) THEN
  RETURN jsonb_build_object('error','invalid_request');
 END IF;
 -- Serialize checks and writes across all Edge Function workers.
 PERFORM pg_advisory_xact_lock(723541992);
 IF NOT studio_visitors.allow_rate('global:requests',600,60) THEN RETURN jsonb_build_object('error','rate_limited','retry_after',60); END IF;
 IF NOT studio_visitors.allow_rate('peer:requests:'||actor,60,60) THEN RETURN jsonb_build_object('error','rate_limited','retry_after',60); END IF;
 IF action='visit' AND NOT EXISTS(SELECT 1 FROM studio_visitors.visits WHERE day=d AND token=visitor) THEN
  IF studio_visitors.allow_rate('global:new-visits:'||d,5000,86400) AND studio_visitors.allow_rate('peer:new-visits:'||d||':'||actor,50,86400) THEN
   INSERT INTO studio_visitors.visits VALUES(d,visitor) ON CONFLICT DO NOTHING;
   GET DIAGNOSTICS added=ROW_COUNT;
   IF added=1 THEN INSERT INTO studio_visitors.daily_counts VALUES(d,1) ON CONFLICT(day) DO UPDATE SET total=studio_visitors.daily_counts.total+1; END IF;
  END IF;
 ELSIF action='post' THEN
  IF EXISTS(SELECT 1 FROM studio_visitors.notes WHERE created>now()-interval '3 seconds' OR ((token=visitor OR actor_hash=actor) AND created>now()-interval '1 minute')) THEN
   RETURN jsonb_build_object('error','rate_limited','retry_after',60);
  END IF;
  IF NOT studio_visitors.allow_rate('peer:posts:'||actor,10,3600) THEN RETURN jsonb_build_object('error','rate_limited','retry_after',3600); END IF;
  INSERT INTO studio_visitors.notes(token,name,message,actor_hash) VALUES(visitor,trim(nickname),trim(note),actor);
 END IF;
 -- Preserve visitor history and messages; expire only transient rate counters.
 DELETE FROM studio_visitors.rate_limits WHERE started_at<now()-interval '2 days';
 RETURN studio_visitors.snapshot();
END;
$$;
REVOKE ALL ON FUNCTION public.studio_guest_activity_secure(text,text,uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.studio_guest_activity_secure(text,text,uuid,text,text) TO service_role;

-- Kept for existing clients while the Edge Function deployment switches over.
-- Count through the same atomic helper to keep daily totals consistent.
CREATE OR REPLACE FUNCTION public.studio_guest_activity(action text,visitor uuid DEFAULT NULL,nickname text DEFAULT NULL,note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 RETURN public.studio_guest_activity_secure(action,repeat('0',64),visitor,nickname,note);
END;
$$;

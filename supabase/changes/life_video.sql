-- Register the lyric video for the existing work-view counter.
INSERT INTO studio_visitors.work_totals(work_id)
VALUES ('life-video') ON CONFLICT(work_id) DO NOTHING;

-- Register the family music video for the existing per-work counter.
INSERT INTO studio_visitors.work_totals(work_id)
VALUES ('overflowing-video') ON CONFLICT (work_id) DO NOTHING;

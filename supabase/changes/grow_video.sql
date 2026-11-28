INSERT INTO studio_visitors.work_totals(work_id)
VALUES ('grow-video') ON CONFLICT (work_id) DO NOTHING;

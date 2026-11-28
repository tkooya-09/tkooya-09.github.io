INSERT INTO studio_visitors.work_totals(work_id)
VALUES ('giving-tree-video') ON CONFLICT (work_id) DO NOTHING;

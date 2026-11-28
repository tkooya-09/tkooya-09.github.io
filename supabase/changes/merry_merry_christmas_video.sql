INSERT INTO studio_visitors.work_totals(work_id)
VALUES ('merry-merry-christmas-video') ON CONFLICT (work_id) DO NOTHING;

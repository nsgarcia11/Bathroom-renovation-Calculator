-- Every PDF download counts toward the free limit (not just unique projects)
-- Drop the UNIQUE constraint so the same project can be exported multiple times
ALTER TABLE pdf_exports DROP CONSTRAINT IF EXISTS pdf_exports_user_id_project_id_key;

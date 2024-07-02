-- What to drop
SELECT CONCAT(CONCAT ('DROP VIEW IF EXISTS ',viewname),' CASCADE ;')
FROM pg_catalog.pg_views
WHERE schemaname = 'public'
AND   NOT (viewname LIKE '%logs%')
UNION ALL
SELECT CONCAT(CONCAT ('DROP FUNCTION IF EXISTS ',proname),' CASCADE ;')
FROM (SELECT *
      FROM PG_PROC
      WHERE pronamespace = 2200
      AND NOT(proname = 'JSONB_BUILD_OBJECT'));

--What to grant
SELECT CONCAT(CONCAT('GRANT ALL ON ',name),' TO express_000;') FROM (
SELECT tablename AS name FROM pg_catalog.pg_tables WHERE schemaname='public' UNION ALL
SELECT viewname AS name FROM pg_catalog.pg_views WHERE schemaname='public');

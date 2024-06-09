CREATE OR REPLACE FUNCTION include_ref (TEXT,TEXT,TEXT,TEXT) RETURNS JSONB
AS
$$
SELECT CAST('{"' ||$1|| '":"' ||$2|| '","' ||$3|| '":"' ||$4|| '"}' AS JSONB) $$ LANGUAGE SQL;

SELECT CONCAT(CONCAT ('DROP VIEW IF EXISTS ',viewname),' CASCADE ;')
FROM pg_catalog.pg_views
WHERE schemaname = 'public'
AND   NOT (viewname LIKE '%logs%')
UNION ALL
SELECT CONCAT(CONCAT ('DROP FUNCTION IF EXISTS ',proname),' CASCADE ;')
FROM (SELECT *
      FROM PG_PROC
      WHERE pronamespace = 2200
      AND   NOT (proname LIKE '%logs%'));

SELECT CONCAT(CONCAT('GRANT SELECT ON ',name),' TO express_000;') FROM (
SELECT tablename AS name FROM pg_catalog.pg_tables WHERE schemaname='public' UNION ALL
SELECT viewname AS name FROM pg_catalog.pg_views WHERE schemaname='public');
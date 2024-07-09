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

--Extract the types of the procedures
SELECT routine_name,
       ':',
       JSONB_OBJECT(ARRAY_AGG(arr_)),
       ','
FROM (SELECT routine_index,
             routine_name,
             table_name,
             ARRAY[column_name,
             data_type] AS arr_
      FROM (SELECT routine_name,
                   type_udt_name AS table_name,
                   REVERSE(SPLIT_PART(REVERSE (specific_name),'_',1)) AS routine_index
            FROM information_schema.routines
            WHERE routine_type = 'FUNCTION'
            AND   routine_schema = 'public') t0
        JOIN (SELECT table_name,
                     column_name,
                     data_type,
                     ordinal_position
              FROM information_schema.columns
              WHERE table_catalog = 'online_artists'
              AND   table_schema = 'public') t1 USING (table_name)
      ORDER BY ordinal_position)
GROUP BY routine_index,
         routine_name,
         table_name
ORDER BY routine_index;

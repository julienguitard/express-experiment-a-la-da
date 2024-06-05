CREATE OR REPLACE FUNCTION include_ref (TEXT,TEXT,TEXT,TEXT) RETURNS JSONB
AS
$$
SELECT CAST('{"' ||$1|| '":"' ||$2|| '","' ||$3|| '":"' ||$4|| '"}' AS JSONB) $$ LANGUAGE SQL;


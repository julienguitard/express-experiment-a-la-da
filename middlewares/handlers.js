const sql_now = () => (Date.now()/1000).toString();

function parseSQLOutput(data) {
    const columns = data.fields.map((f)=>f.name);
    const rows_ = data.rows.map(r=>columns.map(c=>r[c]));
    const parsedData = {columns:columns, rows:rows_}
    return parsedData;
 }

export {sql_now,parseSQLOutput};
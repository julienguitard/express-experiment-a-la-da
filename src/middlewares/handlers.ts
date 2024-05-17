const sql_now : () => string = () => (Date.now()/1000).toString();

function parseSQLOutput(data:{fields:Array<{name:string}>,rows:Array<Array<any>>}):{fields:Array<string>,rows:Array<Array<any>>} {
    const fields = data.fields.map((f)=>f.name);
    const rows = data.rows.map(r=>fields.map(c=>r[c]));
    const parsedData = {fields:fields, rows:rows}
    return parsedData;
 }

export {sql_now,parseSQLOutput};
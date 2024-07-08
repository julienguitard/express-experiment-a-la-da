import {DBProcedure, DBProcedureArgsMappingType} from '../types';


function convertToSql(pro:DBProcedure,params:Array<string>|undefined):string {
    let argsString= '()';
    if (params) {
        argsString='('+params.map((_,i)=>`$${i+1}`).join(',')+')'
    }
    return  `SELECT * FROM ${pro}${argsString} LIMIT 10 ;`
}

function processQueryPoolArgs<T extends keyof DBProcedureArgsMappingType>(
    args: DBProcedureArgsMappingType[T]
  ): Array < string > {
    return Object.entries(args).map(([k,v]) => v);
  
  }

  function parseSQLOutput(
    data: { fields: Array<{ name: string }>, rows: Array<Record<string, any>> },
    cb?: (field: string, value: any) => any
  ): { fields: Array<string>; rows: Array<Array<any>> } {
    const fields = data.fields.map((f) => f.name);
    let rows = data.rows.map((r) => fields.map((c) => r[c]));
    if (cb) {
      rows = data.rows.map((r) => fields.map((c) => cb(c, r[c])));
    }
    const parsedData = { fields: fields, rows: rows };
    return parsedData;
  }
  

export {convertToSql,processQueryPoolArgs,parseSQLOutput}


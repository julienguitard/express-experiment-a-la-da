import {DBProcedure} from 'types';

function convertToSql(pro:DBProcedure):string {
    return  `SELECT * FROM ${pro} ;`
}

export {convertToSql}
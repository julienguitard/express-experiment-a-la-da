import {DBProcedure} from 'types';
import { map } from '../../purescript/output/Data.Functor';

function convertToSql(pro:DBProcedure,params:Array<string>|undefined):string {
    let argsString= '()';
    if (params) {
        argsString='('+params.map((_,i)=>`$${i+1}`).join(',')+')'
    }
    console.log(`SELECT * FROM ${pro}${argsString} ;`);
    return  `SELECT * FROM ${pro}${argsString} ;`
}

export {convertToSql}
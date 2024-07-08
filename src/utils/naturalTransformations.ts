function mapDict<U,V>(f
    :(u:U)=>V,r:Record<string,U>):Record<string,V>{
        const entries:Array<[string,U]> = Object.entries(r);
        const transformedEntries:Array<[string,V]> = entries.map((kv:[string,U])=>[kv[0],f(kv[1])]);
        const newDict:Record<string,V> = Object.fromEntries(transformedEntries);
        return newDict;
}

async function promiseRecord<U>(rec:Record<string,Promise<U>>):Promise<Record<string,U>>{
    const keys:Array<string> = Object.entries(rec).map((kv:[string,Promise<U>])=>kv[0]);
    const values:Array<Promise<U>> = Object.entries(rec).map((kv:[string,Promise<U>])=>kv[1]);
    const prom:Promise<Array<U>> = Promise.all(values);
    const dict:Promise<Record<string,U>> = prom.then((values:U[])=>Object.fromEntries(values.map((v,i)=>[keys[i],v])));
    return dict;
}

export {mapDict, promiseRecord};
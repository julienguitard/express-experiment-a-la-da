function mapDict<T extends string,U,V>(f
    :(u:U)=>V,r:Record<T,U>){
        return Object.fromEntries(Object.entries(r).map((kv:[T,U])=>[kv[0],f(kv[1])]));
}

async function promiseRecord<U>(rec:Record<string,Promise<U>>):Promise<Record<string,U>>{
    const keys = Object.entries(rec).map((kv:[string,Promise<U>])=>kv[0]);
    const values = Object.entries(rec).map((kv:[string,Promise<U>])=>kv[1]);
    const prom = Promise.all(values);
    return prom.then((values:U[])=>Object.fromEntries(values.map((v,i)=>[keys[i],v])))
}

export {mapDict, promiseRecord};
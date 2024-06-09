async function promiseRecord<U>(rec:Record<string,Promise<U>>):Promise<Record<string,U>>{
    const keys = Object.entries(rec).map((kv:[string,Promise<U>])=>kv[0]);
    const values = Object.entries(rec).map((kv:[string,Promise<U>])=>kv[1]);
    const prom = Promise.all(values);
    return prom.then((values:U[])=>Object.fromEntries(values.map((v,i)=>[keys[i],v])))
}

export {promiseRecord};
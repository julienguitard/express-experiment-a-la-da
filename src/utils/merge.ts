async function(ob,cbs){
    cbs.map((cb)=>{cb().then((r)=>{ob = {...ob,...r}})});
}

const { app, port } = require('./app');


app.listen(port);
console.log(`Express started on port ${port}`);

//const p = Promise.resolve(1.0/0.0).then(y=>console.log(y)).catch(err=>console.log('What an err: '+err)).finally(console.log('done'));

async function inverse(x) {
    try {
        const y = await 1.0 / x;
        console.log(y);
    }
    catch (err) {
        console.log('What an err: ' + err);
    }
    finally {
        console.log('done');
    }

};

async function delayIdentity(x) {
    await setTimeout(() => { }, 5000);
    return x;
}

//const q = delayIdentity(5);

//q.then(r=>console.log(r));
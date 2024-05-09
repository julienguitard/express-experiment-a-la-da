const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser')
const {routes,router,viewControler} = require('./routes/router');
const hash = require('./utils/hash');
const {nestedTimeOut,showHashDate,showHashIdDate, delay} = require('./utils/delayedGeneration');
const app = express();
const port = 3001;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'keyboard cat'
  }));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/',router);

app.listen(port);
console.log(`Express started on port ${port}`);

//TO DO 
//console.log(delayedIdentity(1000)(2));
//const x = new Promise((res) => setTimeout(() => {res(2)}, 1000));
//const y = x.then((r)=>{return r*r}).then((r)=>{console.log(r)});
//console.log('Generate random ids:')
//const generateIds = (n) => {nestedTimeOut(showHashIdDate(hash,hash(Date.now().toString())),delay,n)};
//const generateIds_ =(n) => () => {nestedTimeOut(showHashIdDate(hash,hash(Date.now().toString())),delay,n)};
//nestedTimeOut(generateIds_(2),delay,3);
//END OF TODO


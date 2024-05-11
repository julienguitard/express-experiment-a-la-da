const random = Math.random;
const TIMEUNIT = 1000

function nestedTimeOut(callback, time_callback, n) {
  callback();
  if (n > 1) {
    setTimeout(() => { nestedTimeOut(callback, time_callback, n - 1) }, time_callback());
  }
}


const showHashDate = (hash) => { return () => { console.log(hash(Date.now().toString())) } };
const showHashIdDate = (hash, id) => { return () => { console.log(id + ',' + hash(Date.now().toString())) } };
const delay = () => { return TIMEUNIT * random() };

function delayedIdentity(t) {
  function identity(x) {
    return new Promise((res) => setTimeout(() => { res(x) }, t));
  }
  return identity;
}

module.exports = { nestedTimeOut, showHashDate, showHashIdDate, delay };
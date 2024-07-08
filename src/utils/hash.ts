import crypto from 'crypto';

const hash:(s:any)=>string = (s) => crypto.createHash('sha256').update(s).digest('hex');

export {hash};
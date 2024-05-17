import ejs from 'ejs';
const data = {columns:['a','b'],rows:[[2,3,4],[0,1,1]]};
const footer = {views:2,userName:'Ju'};
const props = {footer:footer,data:data};

function mockRenderFile () {
console.log(ejs.renderFile('/Users/julienguitard/local_node_js/express_sandbox/views/logsIndex.ejs',props,'debug'));
}

export {mockRenderFile};

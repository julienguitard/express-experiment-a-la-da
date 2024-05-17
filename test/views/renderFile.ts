import ejs from 'ejs';
const data:Record<string,any> = {columns:['a','b'],rows:[[2,3,4],[0,1,1]]};
const footer:Record<string,any>  = {views:2,userName:'Ju'};
const props:Record<string,any>  = {footer:footer,data:data};

function mockRenderFile ():void {
console.log(ejs.renderFile('/Users/julienguitard/local_node_js/express_sandbox/views/logsIndex.ejs',props,'debug'));
}

export {mockRenderFile};

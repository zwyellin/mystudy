var http = require('http');
var url = require('url');
console.log('begin',process.argv)
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question(`你叫什么名字?`, name => {
    console.log(`你好 ${name}!`)
    readline.close()
  })
http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', "*"); //针对哪个域名可以访问，*表示所有
    response.setHeader('Access-Control-Allow-Credentials', true); //是否可以携带cookie
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, { "Content-Type": "application/json" });
    // 解析 url 参数
    var params = url.parse(request.url, true).query;  
    //parse将字符串转成对象,req.url="/?url=123&name=321"，true表示params是{url:"123",name:"321"}，false表示params是url=123&name=321
    console.log(params);
    var jsonData = JSON.stringify({
        data:params
    });
    response.write(jsonData);
    response.end();
}).listen(8888);
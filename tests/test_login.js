var http = require('http');
var querystring = require('querystring');
var contents = querystring.stringify({//序列化一个对象
    account: '13311111111',
    deviceid: 'asbhkdhjk'
});
var option = {
    method: 'post',
    host: 'localhost',
    port: '8080',
    path: '/services/login',
    headers: {// 必选信息
        "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
        "Content-Length":contents.length, // 请求长度, 通过上面计算得到
    }
};
var Dispose = function(httpRes){
	console.log(httpRes.statusCode);
    var buffers = [];
    httpRes.on('data', function(chunk) {
    	//console.log('aaa'+ chunk);
        buffers.push(chunk);
    });

    httpRes.on('end', function(chunk) {
        var wholeData = Buffer.concat(buffers);
        var dataStr = wholeData.toString('utf8');
        console.log('content: ' + wholeData);
    });
};
var req = http.request(option,Dispose);
req.write(contents);//发送内容
req.end();


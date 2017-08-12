const http = require('http')
const Router = require('koa-router')
const router = new Router()
const oauth_host = 'oauth.anysdk.com'
const oauth_path = '/api/User/LoginOauth/'

router.post('/anylogin', async (ctx, next) => {
  let data = ctx.request.body
  userData = await checkLogin(data)
})

function checkLogin(postData) {
  let options = {
    host: oauth_host,
    path: oauth_path,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': postData.length
    }
  }
  return new Promise(resolve => {
    let reqToAnysdk = http.request(options, resFromAnysdk => {
      resFromAnysdk.setEncoding('utf8')
      resFromAnysdk.on('data', data => {
        console.log('#return data:\n' + data)
        resJson = JSON.parse(data)
        if (resJson && resJson.status == 'ok') {
          resJson.ext = '登陆验证成功'
        }
        resolve(resJson)
      })
    })
    reqToAnysdk.write(postData)
    reqToAnysdk.end()
  })
}

module.exports = router

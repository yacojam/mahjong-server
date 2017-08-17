const http = require('http')
const querystring = require('querystring')
const Router = require('koa-router')
const router = new Router()
const UserDao = require('../db/UserDao')
const TokenManager = require('../redis/tokenRedisDao')
const roomManager = require('../roomManager/roomManager')
const oauth_host = 'oauth.anysdk.com'
const oauth_path = '/api/User/LoginOauth/'

router.post('/anylogin', async (ctx, next) => {
  let data = ctx.request.body
  let anySDKData = await checkLogin(data)
  if (anySDKData.status == 'ok') {
    let wxData = anySDKData.data
    let user = await UserDao.updateOrCreateWXAccount(wxData)
    let token = TokenManager.generateToken(user.userid)
    if (user.roomid.length > 0) {
      if (!roomManager.isRoomValid(user.roomid)) {
        await UserDao.updateRoomID(user.userid, '')
        user.roomid = ''
      }
    }
    let ret = { ...user, token }
    anySDKData.data = ret
  }
  ctx.json = anySDKData
})

function checkLogin(postData) {
  console.log(postData)
  let contents = querystring.stringify(postData)
  let options = {
    host: oauth_host,
    path: oauth_path,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': contents.length
    }
  }
  return new Promise(resolve => {
    let reqToAnysdk = http.request(options, resFromAnysdk => {
      resFromAnysdk.setEncoding('utf8')
      resFromAnysdk.on('data', data => {
        console.log('#return data:\n' + data)
        resJson = JSON.parse(data)
        resolve(resJson)
      })
    })
    reqToAnysdk.write(contents)
    reqToAnysdk.end()
  })
}

module.exports = router

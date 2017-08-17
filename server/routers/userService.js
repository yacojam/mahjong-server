const UserDao = require('../db/UserDao')
const tokenManager = require('../redis/tokenRedisDao')
const roomManager = require('../roomManager/roomManager')
const ErrorType = require('./ServerError')
const Router = require('koa-router')
const router = new Router()

const weixinService = require('../service/weixinService')

router.post('/login', async (ctx, next) => {
  try {
    let account = ctx.request.body.account
    let userData = await UserDao.getOrCreateAccount(account)
    let token = tokenManager.generateToken(userid)
    if (user.roomid.length > 0) {
      if (!roomManager.isRoomValid(user.roomid)) {
        await UserDao.updateRoomID(user.userid, '')
        user.roomid = ''
      }
    }
    console.log('login result : ', ret)
    ctx.json = { ...userData, token }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/weixin_login', async ctx => {
  const code = ctx.request.body.code
  console.log(`login with code: ${code}`)
  try {
    const tokenInfo = await weixinService.getAccessToken(code)
    console.log(`tokenInfo: ${tokenInfo}`)
    const userinfo = await weixinService.getWeixinUserInfo(
      tokenInfo.access_token,
      tokenInfo.openid
    )
    let user = await UserDao.updateOrCreateWXAccount(wxData)
    let token = tokenManager.generateToken(user.userid)
    if (user.roomid.length > 0) {
      if (!roomManager.isRoomValid(user.roomid)) {
        await UserDao.updateRoomID(user.userid, '')
        user.roomid = ''
      }
    }
    let ret = { ...user, token }
    console.log('login result : ', ret)
    await weixinService.saveUser(weixinUser, openid)
    ctx.json = ret
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.get('/get_account_info', async (ctx, next) => {
  var userid = ctx.query.userid
  var token = ctx.query.token
  var isValid = await tokenManager.isAccountValid(userid, token)
  if (isValid) {
    var userData = await UserDao.getUserDataByUserid(userid)
    if (userData) {
      var ret = { ...userData, token }
      if (ret.roomid.length > 0) {
        var isroomValid = roomManager.isRoomValid(ret.roomid)
        if (!isroomValid) {
          await UserDao.updateRoomID(user.userid, '')
          ret.roomid = ''
        }
      }
      console.log('get account result : ' + ret)
      ctx.json = ret
    } else {
      ctx.error = ErrorType.AccountError
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})
module.exports = router

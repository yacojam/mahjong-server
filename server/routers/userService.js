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
    let user = await UserDao.getOrCreateAccount(account)
    let token = tokenManager.generateToken(user.userid)
    if (user.roomid.length > 0) {
      if (!roomManager.isRoomValid(user.roomid)) {
        await UserDao.updateRoomID(user.userid, '')
        user.roomid = ''
      }
    }
    let ret = Object.assign({}, user, { token })
    console.log('login result : ', ret)
    ctx.json = ret
    //ctx.json = { ...userData, token }
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
    let user = await UserDao.updateOrCreateWXAccount(userinfo)
    let token = tokenManager.generateToken(user.userid)
    if (user.roomid && user.roomid.length > 0) {
      if (!roomManager.isRoomValid(user.roomid)) {
        await UserDao.updateRoomID(user.userid, '')
        user.roomid = ''
      }
    }
    let ret = Object.assign({}, user, { token })
    //let ret = { ...user, token }
    console.log('login result : ', ret)
    // await weixinService.saveUser(userinfo, tokenInfo.openid)
    ctx.json = ret
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/quick_login', async (ctx, next) => {
  var userid = ctx.request.body.userid
  var token = ctx.request.body.token
  var isValid = await tokenManager.isAccountValid(userid, token)
  if (isValid) {
    var user = await UserDao.getUserDataByUserid(userid)
    if (user) {
      if (user.roomid && user.roomid.length > 0) {
        if (!roomManager.isRoomValid(user.roomid)) {
          await UserDao.updateRoomID(user.userid, '')
          user.roomid = ''
        }
      }
      //var ret = { ...userData, token }
      let ret = Object.assign({}, user, { token })
      console.log('login result : ' + ret)
      ctx.json = ret
    } else {
      ctx.error = ErrorType.AccountError
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.get('/update_account_info', async (ctx, next) => {
  let userid = ctx.query.userid
  let token = ctx.query.token
  let record = ctx.query.fields
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      await UserDao.updateUserInfo(userid, record)
      let user = await UserDao.getUserDataByUserid(userid)
      ctx.json = user
    } catch (e) {
      console.log(e)
      ctx.error = {
        code: -1,
        message: e.message || e.toString
      }
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

module.exports = router

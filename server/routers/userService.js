//const co = require('co');
const UserDao = require('../db/UserDao')
const RoomDao = require('../db/RoomDao')
const tokenManager = require('../redis/tokenRedisDao')
const roomManager = require('../roomManager/roomManager')
const ErrorType = require('./ServerError')
const Router = require('koa-router')
const router = new Router()

const weixinService = require('../service/weixinService')

router.post('/login', async (ctx, next) => {
  var account = ctx.request.body.account
  var deviceid = ctx.request.body.deviceid
  var userData = await UserDao.sync_get_account_info(account)
  if (userData == null) {
    //数据库没有该用户，为该手机号码创建账户
    var userid = await UserDao.sync_create_account(account, '', '小白', 1, '')
    if (userid > 0) {
      //生成token
      let token = tokenManager.generateToken(userid, deviceid)
      var ret = {
        isNew: true,
        userid: userid,
        account: account,
        wxid: '',
        name: '小白',
        sex: 1,
        headimg: '',
        card: 9,
        roomid: 0,
        token: token
      }
      ctx.json = ret
    } else {
      ctx.error = ErrorType.RegisterError
    }
  } else {
    let token = tokenManager.generateToken(userData.userid, deviceid)
    var ret = {
      isNew: false,
      userid: userData.userid,
      account: userData.account,
      wxid: userData.wxid,
      name: userData.name,
      sex: userData.sex,
      headimg: userData.headimg,
      card: userData.card,
      roomid: userData.roomid,
      token: token
    }
    //做一层保护，如果当前用户处于某个房间中，判断当前房间是否valid
    if (ret.roomid > 0) {
      var isroomValid = roomManager.isRoomValid(ret.roomid)
      if (!isroomValid) {
        await UserDao.sycn_update_roomid_of_userid('', userData.userid)
        ret.roomid = ''
      }
    }
    console.log('login result : ', ret)
    ctx.json = ret
  }
})

router.post('/weixin_login', async ctx => {
  const AppSecret = 'a7aa5b67373af823277d447a770bc0c6'
})

router.get('/get_account_info', async (ctx, next) => {
  var userid = ctx.query.userid
  var token = ctx.query.token
  var isValid = await tokenManager.isAccountValid(userid, token)
  if (isValid) {
    var userData = await UserDao.sync_get_account_info_by_userid(userid)
    if (userData) {
      var ret = {
        userid: userData.userid,
        account: userData.account,
        wxid: userData.wxid,
        name: userData.name,
        sex: userData.sex,
        headimg: userData.headimg,
        card: userData.card,
        roomid: userData.roomid,
        token: token
      }
      //做一层保护，如果当前用户处于某个房间中，判断当前房间是否valid
      if (ret.roomid > 0) {
        var isroomValid = roomManager.isRoomValid(ret.roomid)
        if (!isroomValid) {
          await UserDao.sycn_update_roomid_of_userid('', userData.userid)
          ret.roomid = ''
        }
      }
      console.log('get account result : ')
      console.log(ret)
      ctx.json = ret
    } else {
      ctx.error = ErrorType.AccountError
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

module.exports = router

const UserDao = require('../db/UserDao')
const RoomDao = require('../db/RoomDao')
const cryptoHelper = require('../md5/cryptoHelper')
const redis = require('../redis/redisHelper')
const ErrorType = require('./ServerError')
const Router = require('koa-router')
const router = new Router()
const HxRulesUtils = require('../roomManager/roomRuleUtil/HxRulesUtils')
const roomFactory = require('../roomManager/factory')

router.get('/get_rules', async (ctx, next) => {
  var userid = ctx.query.userid
  var deviceid = ctx.query.deviceid
  var token = ctx.query.token
  var isValid = true //await redis.isAccountValid(userid, deviceid, token);
  if (isValid) {
    ctx.json = HxRulesUtils.rules
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

//创建房间
router.get('/create_private_room', async (ctx, next) => {
  var userid = ctx.query.userid
  var deviceid = ctx.query.deviceid
  var token = ctx.query.token
  var roomConfigs = ctx.query.roomConfigs
  if (typeof roomConfigs === 'string') {
    roomConfigs = JSON.parse(roomConfigs)
  }
  var isValid = await redis.isAccountValid(userid, deviceid, token)
  if (isValid) {
    var cardnum_of_user = await UserDao.sycn_get_card_of_account(userid)
    if (cardnum_of_user == 0) {
      ctx.error = ErrorType.CardNotEnoughError
    } else {
      ret = await roomFactory.createRoom(userid, cardnum_of_user, roomConfigs)
      if (ret.code == 1) {
        ctx.error = ErrorType.CardNotEnoughError
      }
      if (ret.code == 2) {
        ctx.error = ErrorType.RoomCreateError
      }
      if (ret.code == 0) {
        ctx.json = ret.data
      }
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})
//进入房间
router.get('/join_private_room', async (ctx, next) => {
  var userid = ctx.query.userid
  var deviceid = ctx.query.deviceid
  var token = ctx.query.token
  var rpid = ctx.query.roomid
  var isValid = await redis.isAccountValid(userid, deviceid, token)
  if (isValid) {
    var ret = await roomFactory.enterRoom(userid, rpid)
    console.log(ret)
    if (ret.code == 0) {
      ctx.json = ret.data
    }
    if (ret.code == 1) {
      ctx.error = ErrorType.RoomNotExistError
    }
    if (ret.code == 2) {
      ctx.error = ErrorType.RoomHasFullError
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})
module.exports = router

const UserDao = require('../db/UserDao')
const RoomDao = require('../db/RoomDao')
const cryptoHelper = require('../md5/cryptoHelper')
const tokenManager = require('../redis/tokenRedisDao')
const ErrorType = require('./ServerError')
const Router = require('koa-router')
const router = new Router()
const HxRulesUtils = require('../manager/roomManager/util/HxRulesUtils')
const roomManager = require('../manager/roomManager/roomManager')

router.get('/get_rules', async (ctx, next) => {
  let userid = ctx.query.userid
  let token = ctx.query.token
  let isValid = await tokenManager.isAccountValid(userid, token)
  if (isValid) {
    ctx.json = HxRulesUtils.rules
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

//创建房间
router.post('/create_private_room', async (ctx, next) => {
  let userid = ctx.request.body.userid
  let token = ctx.request.body.token
  let roomConfigs = ctx.request.body.roomConfigs
  if (typeof roomConfigs === 'string') {
    roomConfigs = JSON.parse(roomConfigs)
  }
  let isValid = await tokenManager.isAccountValid(userid, token)
  if (isValid) {
    ret = await roomManager.createRoom(userid, roomConfigs)
    if (ret.code == 1) {
      ctx.error = ErrorType.CardNotEnoughError
    }
    if (ret.code == 2) {
      ctx.error = ErrorType.RoomCreateError
    }
    if (ret.code == 0) {
      let room = ret.data.room
      ctx.json = { rpid: room.roomPresentId, sign: room.sign }
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})
//进入房间
router.get('/join_private_room', async (ctx, next) => {
  var userid = ctx.query.userid
  var token = ctx.query.token
  var rpid = ctx.query.roomid
  var isValid = await tokenManager.isAccountValid(userid, token)
  if (isValid) {
    var ret = await roomManager.preEnterRoom(userid, rpid)
    console.log(ret)
    if (ret.code == 0) {
      let room = ret.data.room
      ctx.json = { rpid: room.roomPresentId, sign: room.sign }
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

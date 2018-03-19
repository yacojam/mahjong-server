const Router = require('koa-router')
const router = new Router()
const UserDao = require('../db/UserDao')
const msgManager = require('../manager/msgManager/msgManager')
const tokenManager = require('../redis/tokenRedisDao')
const roomManager = require('../manager/roomManager/roomManager')
const noticeManager = require('../redis/noticeRedisDao')
const ErrorType = require('./ServerError')
  
router.use(tokenManager.tokenChecker())

//获取大厅的一些展示信息
router.get('/get_hall_info', async (ctx, next) => {
	const userid = ctx.header.userid
	const token = ctx.header.token
	var user = await UserDao.getUserDataByUserid(userid)
	if (user) {
		const lastMsg = await msgManager.getLastMsg(userid)
		if (user.roomid && user.roomid.length > 0) {
			if (!roomManager.isRoomValid(user.roomid)) {
				await UserDao.updateRoomID(user.userid, '')
				user.roomid = ''
			}
		}
		let notice = await noticeManager.getNotice()
		if (notice == null) {
			notice = '新 鲜 出 炉 的 和 县 麻 将'
		}
		let ret = Object.assign({}, user, { token, notice })
		// 返回最新消息的id
		if (lastMsg && lastMsg.state == 0) {
			ret.msgIndex = lastMsg.id
		}
		ctx.json = ret
	} else {
		ctx.error = ErrorType.AccountError
	}
})

// 整合各类型用户消息并按时间排序返回，目前仅包含棋牌室申请消息
router.get('/get_messages', async (ctx, next) => {
	const userid = parseInt(ctx.header.userid)
	var msgs = await msgManager.getUserMessages(userid)
	ctx.json = msgs
})

router.post('/mark_msg_read', async (ctx, next) => {
	let { msgid } = ctx.request.body
	await msgManager.updateState(msgid, 1)
	ctx.json = {result: true}
})

module.exports = router

const Router = require('koa-router')
const router = new Router()
const UserDao = require('../db/UserDao')
const tokenManager = require('../redis/tokenRedisDao')
const roomManager = require('../roomManager/roomManager')
const noticeManager = require('../redis/noticeRedisDao')

//获取大厅的一些展示信息
router.get('/get_hall_info', async (ctx, next) => {
	let userid = ctx.query.userid
	let token = ctx.query.token
	let isValid = await tokenManager.isAccountValid(userid, token)
	if (isValid) {
		var user = await UserDao.getUserDataByUserid(userid)
		if (user) {
			if (user.roomid && user.roomid.length > 0) {
				if (!roomManager.isRoomValid(user.roomid)) {
					await UserDao.updateRoomID(user.userid, '')
					user.roomid = ''
				}
			}
			let userInfo = Object.assign({}, user, { token })
			let notice = await noticeManager.getNotice()
			if (notice == null) {
				notice = '新 鲜 出 炉 的 和 县 麻 将'
			}
			ctx.json = { userInfo, notice }
		} else {
			ctx.error = ErrorType.AccountError
		}
	} else {
		ctx.error = ErrorType.AccountValidError
	}
})

module.exports = router

const ErrorType = require('../routers/ServerError')
const redis = require('./redisHelper')
const cryptoHelper = require('../md5/cryptoHelper')

function tokenChecker(whiteList) {
	return async (ctx, next) => {
			const routeName = ctx.path.substring(
				ctx.path.lastIndexOf('/'),
				ctx.path.length
			)
			if (whiteList && whiteList.indexOf(routeName) != -1) {
				return next()
			}
		
			const userid = ctx.header.userid
			const token = ctx.header.token
	
			let isValid = await isAccountValid(userid, token);
			if (isValid) {
				return next()
			} else {
				ctx.error = ErrorType.AccountValidError
			}
		}
  }

async function isAccountValid(userid, uToken) {
	console.log(uToken)
	let data = await redis.get(userid + 'token')
	if (data === null) {
		return false
	}
	if (data != uToken) {
		return false
	}
	let stamp = await redis.get(userid + 'validtime')
	let nowStamp = Date.parse(new Date())
	return nowStamp < stamp
}

async function validateAdmaxAccount(userid, uToken) {
	console.log(uToken)
	let data = await redis.get("admax_" + userid + 'token')
	if (data === null) {
		return false
	}
	if (data != uToken) {
		return false
	}
	let stamp = await redis.get("admax_" + userid + 'validtime')
	let nowStamp = Date.parse(new Date())
	return nowStamp < stamp
}

// TODO yyj deviceid
function generateToken(userid, deviceid = 'device') {
	let token = cryptoHelper.md5(userid + deviceid + Date.parse(Date.now()))
	console.log(token)
	let date = new Date()
	date.setDate(date.getDate() + 60)
	let validStamp = Date.parse(date)
	redis.set(userid + 'token', token)
	redis.set(userid + 'validtime', validStamp)
	return token
}

module.exports = { generateToken, isAccountValid, tokenChecker }

// async function test() {
// 	var token = generateToken('13233232', 'dshsdli')
// 	let aa = await isAccountValid('13233232', token)
// 	console.log(aa)
// }

// test()

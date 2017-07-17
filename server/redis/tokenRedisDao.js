const redis = require('./redisHelper')
const cryptoHelper = require('../md5/cryptoHelper')

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

function generateToken(userid, deviceid) {
	let token = cryptoHelper.md5(userid + deviceid + Date.parse(Date.now()))
	console.log(token)
	let date = new Date()
	date.setDate(date.getDate() + 60)
	let validStamp = Date.parse(date)
	redis.set(userid + 'token', token)
	redis.set(userid + 'validtime', validStamp)
	return token
}

module.exports = { generateToken, isAccountValid }

// async function test() {
// 	var token = generateToken('13233232', 'dshsdli')
// 	let aa = await isAccountValid('13233232', token)
// 	console.log(aa)
// }

// test()

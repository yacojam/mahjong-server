const redis = require('./redisHelper')
const tag = 'shared_yyj_set'

async function getAllSharedUsers() {
	let allSharesUsers = await redis.smembers(tag)
	console.log(allSharesUsers)
	return allSharesUsers || []
}

function save(userid) {
	redis.sadd(tag, userid)
}

function del(userid) {
	redis.srem(tag, userid)
}

module.exports = { getAllSharedUsers, save, del }

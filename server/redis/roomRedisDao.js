const redis = require('./redisHelper')
const setName = 'roomSet'

function saveRoom(rpid, roomInfo) {
	redis.sadd(setName, rpid)
	let roomInfoString = JSON.stringify(roomInfo)
	redis.set(rpid, roomInfoString)
}

function deleteRoom(rpid) {
	redis.srem(setName, rpid)
	redis.del(rpid)
}

async function recoverRoom() {
	let rpids = await redis.smembers(setName)
	console.log(rpids)
	if (rpids === null || rpids.length === 0) {
		return null
	}
	let ret = {}
	for (let rpid of rpids) {
		let roomInfoString = await redis.get(rpid)
		let roomInfo = JSON.parse(roomInfoString)
		ret[rpid] = roomInfo
	}
	return ret
}

module.exports = {
	saveRoom,
	deleteRoom,
	recoverRoom
}

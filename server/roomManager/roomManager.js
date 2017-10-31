const roomRedisDao = require('../redis/roomRedisDao')

var manager = {}
var ids = new Set()
var user2ids = {}

async function start() {
	cacheRooms = await roomRedisDao.recoverRoom()
	if (cacheRooms == null) {
		return
	}
	for (let rpid in cacheRooms) {
		let roomInfo = cacheRooms[rpid]
		manager[rpid] = roomInfo
		ids.add(rpid)
		roomInfo.seats.forEach(seat => {
			if (seat.userid > 0) {
				user2ids[seat.userid] = rpid
			}
		})
	}
}

function isRoomValid(roomPresentId) {
	return ids.has(roomPresentId) && !!manager[roomPresentId]
}

function setRoom(roomPresentId, roomInfo) {
	manager[roomPresentId] = roomInfo
	ids.add(roomPresentId)
	roomRedisDao.saveRoom(roomPresentId, roomInfo)
}

function getRoom(roomPresentId) {
	return manager[roomPresentId] || null
}

function updateRoom(roomPresentId) {
	let roomInfo = getRoom(roomPresentId)
	if (roomInfo == null) {
		roomRedisDao.deleteRoom(rpid)
	} else {
		roomRedisDao.saveRoom(roomPresentId, roomInfo)
	}
}

function delRoom(roomPresentId) {
	delete manager[roomPresentId]
	ids.delete(roomPresentId)
	roomRedisDao.deleteRoom(roomPresentId)
}

function setRidForUid(rpid, uid) {
	user2ids[uid] = rpid
}

function getRidForUid(uid) {
	return user2ids[uid] || null
}

function delUid(uid) {
	delete user2ids[uid]
}

module.exports = {
	start,
	isRoomValid,
	setRoom,
	getRoom,
	updateRoom,
	delRoom,
	setRidForUid,
	getRidForUid,
	delUid,
	data: manager
}

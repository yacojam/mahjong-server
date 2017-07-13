var manager = {}
var ids = new Set()

function isRoomValid(roomPresentId) {
	return ids.has(roomPresentId) && !!manager[roomPresentId]
}

function setRoom(roomPresentId, roomInfo) {
	manager[roomPresentId] = roomInfo
	ids.add(roomPresentId)
}

function getRoom(roomPresentId) {
	return manager[roomPresentId] || null
}

function delRoom(roomPresentId) {
	delete manager[roomPresentId]
	ids.delete(roomPresentId)
}

var user2ids = {}

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
	isRoomValid,
	setRoom,
	getRoom,
	delRoom,
	setRidForUid,
	getRidForUid,
	delUid
}

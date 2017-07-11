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
	return manager[roomPresentId]
}

function delRoom(roomPresentId) {
	delete manager[roomPresentId]
	ids.delete(roomPresentId)
}

module.exports = {
	setRoom,
	getRoom,
	delRoom
}

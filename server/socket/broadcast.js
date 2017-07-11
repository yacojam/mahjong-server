const roomManager = require('../roomManager/roomManager')
const connectionManager = require('./connectionManager')

function broadcastInRoom(message, data, userid, includedSender) {
	var rpid = roomManager.getRidForUid(userid)
	if (rpid == null || rpid == '') {
		return
	}

	var roomInfo = roomManager.getRoom(rpid)
	if (roomInfo == null) {
		return
	}

	for (var i = 0; i < 4; i++) {
		if (roomInfo.seats[i].userid > 0) {
			if (roomInfo.seats[i].userid == userid && !includedSender) {
				continue
			}
			connectionManager.sendMessage(
				roomInfo.seats[i].userid,
				message,
				data
			)
		}
	}
}

module.exports = {
	broadcastInRoom
}

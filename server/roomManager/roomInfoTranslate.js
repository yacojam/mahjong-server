const RoomInfo = require('./roomInfo')

function transform(roomStruct) {
	let roomInfo = new RoomInfo(
		roomStruct.roomId,
		roomStruct.roomPresentId,
		roomStruct.createUid,
		roomStruct.rule,
		roomStruct.conf
	)
	roomInfo.ruleType = roomStruct.ruleType
	roomInfo.dealerIndex = roomStruct.dealerIndex
	//roomInfo.seats = roomStruct.seats
	roomInfo.sign = roomStruct.sign
	//roomInfo.result = roomStruct.result
	return roomInfo
}

module.exports = { transform }

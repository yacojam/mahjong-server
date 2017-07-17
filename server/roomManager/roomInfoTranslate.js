const RoomInfo = require('./roomInfo')

function transform(roomStruct) {
	let roomInfo = new RoomInfo(
		roomStruct.roomId,
		roomStruct.roomPresentId,
		roomStruct.createUid,
		roomStruct.rule,
		roomStruct.conf
	)
	this.ruleType = roomStruct.ruleType
	this.dealerIndex = roomStruct.dealerIndex
	this.seats = roomStruct.seats
	this.sign = roomStruct.sign
	this.result = roomStruct.result
	return roomInfo
}

module.exports = { transform }

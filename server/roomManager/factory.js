const roomManager = require('./roomManager')
const roomUtil = require('./roomRuleUtil/HxRulesUtils')
const RoomInfo = require('./roomInfo')
const roomDao = require('../db/RoomDao')
const userDao = require('../db/UserDao')
const crypto = require('../md5/cryptoHelper')

function generateRandomId() {
	var roomid = ''
	for (var i = 0; i < 6; i++) {
		roomid += Math.floor(Math.random() * 5)
	}
	return roomid
}

async function createRoom(userid, userCardNum, userConfigs) {
	var ret = {}
	var roomCard = roomUtil.getCardOfRule(userConfigs)
	if (userCardNum < roomCard) {
		ret.success = false
		ret.code = 1 //房卡不够
		return ret
	} else {
		var ensureRoomValid = function() {
			var rid = generateRandomId()
			if (roomManager.isRoomValid(rid)) {
				return ensureRoomValid()
			}
			return rid
		}
		var roomPresentId = ensureRoomValid()
		var roomRule = roomUtil.getRoomRule(userConfigs)
		//加await
		var roomid = await roomDao.sync_create_room(
			userid,
			roomPresentId,
			Date.now(),
			JSON.stringify(roomRule)
		)

		if (roomid == 0) {
			ret.success = false
			ret.code = 2 //创建房间失败
			return ret
		} else {
			var roomConf = roomUtil.getRoomConfig(userConfigs)
			var room = new RoomInfo(
				roomid,
				roomPresentId,
				userid,
				roomRule,
				roomConf
			)
			room.sign = crypto.md5(roomPresentId)
			room.seats[0].userid = userid
			ret.success = true
			ret.code = 0
			ret.data = { rpid: roomPresentId, sign: room.sign }
			roomManager.setRoom(roomPresentId, room)
			//更新数据库用户信息,加await
			await userDao.sycn_update_roomid_of_userid(roomPresentId, userid)
			return ret
		}
	}
}

async function enterRoom(userid, rpid) {
	var ret = {}
	if (!roomManager.isRoomValid(rpid)) {
		ret.code = 1 //房间不存在
		return ret
	} else {
		//判断房间有没有满
		let room = roomManager.getRoom(rpid)
		var emptyIndex = room.getEmptyIndex()
		console.log(emptyIndex)
		if (emptyIndex >= 0) {
			room.seats[emptyIndex].userid = userid
			ret.code = 0
			ret.data = { rpid: rpid, sign: room.sign }
			//更新数据库用户信息,加await
			await userDao.sycn_update_roomid_of_userid(rpid, userid)
			return ret
		} else {
			ret.code = 2 //房间已满
			return ret
		}
	}
}

module.exports = {
	createRoom,
	enterRoom
}


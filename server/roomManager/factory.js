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
	return new Promise(resolve => {
		var ret = {}
		var roomCard = roomUtil.getCardOfRule(userConfigs)
		if (userCardNum < roomCard) {
			ret.success = false
			ret.code = 1 //房卡不够
			resolve(ret)
		}

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
		var roomid = roomDao.sync_create_room(
			userid,
			roomPresentId,
			Date.now(),
			JSON.stringify(roomRule)
		)
		if (roomid == 0) {
			ret.success = false
			ret.code = 2 //创建房间失败
			resolve(ret)
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
			ret.data = { rid: roomPresentId, sign: room.sign }
			roomManager.setRoom(roomPresentId, room)
			//更新数据库用户信息,加await
			userDao.sycn_update_roomid_of_userid(roomPresentId, userid)
			resolve(ret)
		}
	})
}

async function enterRoom(userid, rpid) {
	return new Promise(resolve => {
		var ret = {}
		if (roomManager.isRoomValid(rid)) {
			ret.success = false
			ret.code = 1 //房间不存在
			resolve(ret)
		}
		//判断是否已经在房间内
		if (roomManager[rpid].getUserIndex(userid) >= 0) {
			ret.success = true
			ret.code = 0
			ret.type = 'reconnect'
			ret.data = { rid: rpid, sign: roomManager[rpid].sign }
			resolve(ret)
		}

		//判断房间有没有满
		var emptyIndex = roomManager[rpid].getEmptyIndex()
		if (emptyIndex >= 0) {
			roomManager[rpid].seat[emptyIndex].userid = userid
			ret.success = true
			ret.code = 0
			ret.type = 'connect'
			ret.data = { rid: rpid, sign: roomManager[rpid].sign }
			//更新数据库用户信息,加await
			userDao.sycn_update_roomid_of_userid(roomPresentId, userid)
			resolve(ret)
		}
		ret.success = false
		ret.code = 2 //房间已满
		resolve(ret)
	})
}

async function exitRoom(userid, rpid) {
	return new Promise(resolve => {
		var ret = {}
		index = roomManager[rpid].getUserIndex(userid)
		if (index == -1) {
			ret.success = false
			ret.code = 1 //该房间用户不存在
			resolve(ret)
		}
		roomManager[rpid].seat[index] = { userid: 0 }
		//更新数据库用户信息,加await
		userDao.sycn_update_roomid_of_userid('', userid)
		ret.success = true
		ret.code = 0 //房间已满
		resolve(ret)
	})
}

async function dissolveRoom(userid, rpid) {
	return new Promise(resolve => {
		var ret = {}
		if (!roomManager[rpid].isCreator(userid)) {
			ret.success = false
			ret.code = 1 //非房主不能解散房间
		}
	})
}

const ruleUtil = require('./util/HxRulesUtils')
const roomDao = require('../../db/RoomDao')
const userDao = require('../../db/UserDao')
const QpsDao = require('../../db/QpsDao')
const crypto = require('../../md5/cryptoHelper')
const Room = require('./roomInfo')

let user2ids = {}
let RoomMap = {}

function generateRandomId() {
	var roomid = ''
	for (var i = 0; i < 6; i++) {
		roomid += Math.floor(Math.random() * 10)
	}
	return roomid
}

function ensureRoomValid() {
	let rid = generateRandomId()
	if (isRoomValid(rid)) {
		return ensureRoomValid()
	}
	return rid
}

function isRoomValid(rpid) {
	return RoomMap[rpid] != null
}

async function createRoom(userid, userConfigs, qpsid) {
	var ret = {}
	var roomCard = ruleUtil.getCardOfRule(userConfigs)
	var userCard = await userDao.getCardNum(userid)
	if (userCard < roomCard) {
		ret.code = 1 //房卡不够
		return ret
	}
	var rpid = ensureRoomValid()
	var roomRule = ruleUtil.getRoomRule(userConfigs)
	var roomid = await roomDao.createRoom(
		userid,
		rpid,
		Date.now(),
		JSON.stringify(roomRule)
	)
	if (roomid == 0) {
		ret.code = 2 //创建房间失败
		return ret
	}
	var conf = ruleUtil.getRoomConfig(userConfigs)
	var room = new Room(rpid, userid, roomRule, conf, qpsid)
	room.sign = crypto.md5(rpid)
	ret.code = 0
	ret.data = { room }
	await userDao.deleteCardNum(userid, room.rule.numOfJu)
	RoomMap[rpid] = room
	return ret
}

async function isRoomValidForUserId(userid, rpid) {
	if (!isRoomValid(rpid)) {
		return false
	}
	let room = getRoom(rpid)
	if (room.qpsid) {
		let isUserInQps = await QpsDao.getQpsForUserid(userid, qpsid)
		if (!isUserInQps) {
			return false
		}
	}
	return true
}

async function preEnterRoom(userid, rpid) {
	var ret = {}
	let valid = await isRoomValidForUserId(userid, rpid)
	if (!valid) {
		ret.code = 1 //房间不存在
		return ret
	}
	//判断房间有没有满
	let room = getRoom(rpid)
	let index = room.getUserIndex(userid)
	if (index >= 0) {
		//用户已经在房间里
		ret.code = 0
		ret.data = { room }
		return ret
	}
	var emptyIndex = room.getEmptyIndex()
	if (emptyIndex >= 0) {
		ret.code = 0
		ret.data = { room }
		return ret
	}
	ret.code = 2 //房间已满
	return ret
}

async function joinRoom(userid, rpid) {
	var ret = {}
	let valid = await isRoomValidForUserId(userid, rpid)
	if (!valid) {
		ret.code = 1 //房间不存在
		return ret
	}
	//判断房间有没有满
	let room = getRoom(rpid)
	let index = room.getUserIndex(userid)
	if (index >= 0) {
		//用户已经在房间里
		ret.code = 0
		ret.data = { room, isnew: false }
		return ret
	}
	var emptyIndex = room.getEmptyIndex()
	console.log(emptyIndex)
	if (emptyIndex >= 0) {
		let seat = room.seats[emptyIndex]
		let dbData = await userDao.getUserDataByUserid(userid)
		seat.userid = userid
		seat.username = dbData.name
		seat.headimg = dbData.headimg
		seat.isCreator = room.isCreator(userid)
		seat.sex = dbData.sex
		setRidForUid(rpid, userid)
		await userDao.updateRoomID(userid, rpid)
		ret.code = 0
		ret.data = { room, isnew: true, emptyIndex }
		return ret
	}
	ret.code = 2 //房间已满
	return ret
}

async function exitRoom(userid) {
	let ret = {}
	var rpid = getRidForUid(userid)
	if (rpid == null) {
		ret.code = 1
		return ret
	}
	var room = getRoom(rpid)
	if (room.isCreator(userid) && !room.qpsid) {
		ret.code = 1
		return ret
	}
	//牌局已经开始，建议走申请牌局解散
	if (room.state != 0) {
		ret.code = 2
		return ret
	}

	index = room.getUserIndex(userid)
	room.clearSeat(index)
	await userDao.updateRoomID(userid, '')
	//清除信息
	delUid(userid)
	ret.code = 0
	ret.room = room
	return ret
}

async function dissolveRoom(rpid) {
	let room = getRoom(rpid)
	let users = []
	for (let seat of room.seats) {
		if (seat.userid > 0) {
			users.push(seat.userid)
			delUid(seat.userid)
			await userDao.updateRoomID(seat.userid, '')
		}
	}
	delRoom(rpid)
	if (room.state == 0) {
		await userDao.addCardNum(room.createUid, room.rule.numOfJu)
	}
	return users
}

async function finishRoom(rpid) {
	let room = getRoom(rpid)
	let users = []
	for (let seat of room.seats) {
		if (seat.userid > 0) {
			users.push(seat.userid)
			delUid(seat.userid)
			await userDao.updateRoomID(seat.userid, '')
		}
	}
	setTimeout(() => {
		delRoom(rpid)
	}, 600000)
	return users
}

function getRoomForUserId(userid) {
	let rpid = getRidForUid(userid)
	if (rpid) {
		return getRoom(rpid)
	}
	return null
}

function getRoom(rpid) {
	return RoomMap[rpid] || null
}

function delRoom(rpid) {
	delete RoomMap[rpid]
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

function isMatched(rpid, sign) {
	let room = getRoom(rpid)
	if (!room) {
		return false
	}
	return room.sign == sign
}

function getRoomsForQps(qpsid) {
	return Object.keys(RoomMap)
		.map(key => RoomMap[key])
		.filter(r => {
			return r.state == 0 && r.qpsid && r.qpsid == qpsid
		})
}

module.exports = {
	createRoom,
	preEnterRoom,
	joinRoom,
	exitRoom,
	dissolveRoom,
	finishRoom,
	getRoomForUserId,
	isMatched,
	isRoomValid,
	getRoomsForQps
}

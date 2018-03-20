const ruleUtil = require('./util/HxRulesUtils')
const roomDao = require('../../db/RoomDao')
const userDao = require('../../db/UserDao')
const QpsDao = require('../../db/QpsDao')
const crypto = require('../../md5/cryptoHelper')
const Room = require('./roomInfo')

let user2ids = {}
let RoomMap = {}

async function transformRoomInfo(roomInfo) {
	let {
		presentid,
		baseinfo,
		createuserid,
		createtime,
		userid0,
		userid1,
		userid2,
		userid3,
		roomresult
	} = roomInfo
	let userConfigs = JSON.parse(baseinfo)
	var conf = ruleUtil.getRoomConfig(userConfigs)
	let roomResult = JSON.parse(roomresult)
	let seats = [userid0, userid1, userid2, userid3]
	let seatDatas = []
	for (let i = 0; i < 4; i++) {
		let userData = await userDao.getUserDataByUserid(seats[i])
		let { name, sex, headimg } = userData
		seatDatas.push({
			index: i,
			userid: seats[i],
			username: name,
			sex,
			headimg,
			isCreator: seats[i] == createuserid
		})
	}

	return {
		createUserid: createuserid,
		createTime: createtime,
		roomId: presentid,
		conf,
		roomResult,
		seats: seatDatas
	}
}

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
	var roomid = await roomDao.createRoom(
		userid,
		rpid,
		getTimeString(),
		JSON.stringify(userConfigs)
	)
	if (roomid == 0) {
		ret.code = 2 //创建房间失败
		return ret
	}
	var roomRule = ruleUtil.getRoomRule(userConfigs)
	var conf = ruleUtil.getRoomConfig(userConfigs)
	var room = new Room(roomid, rpid, userid, roomRule, conf, qpsid)
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
		let isUserInQps = await QpsDao.getQpsForUserid(userid, room.qpsid)
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
		seat.isCreator = room.isCreator(userid) && room.qpsid == null
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

async function startRoom(room) {
	let userids = room.seats.map(s => s.userid)
	await roomDao.updateUsers(room.rid, userids)
}

async function startRoomRecord(room) {
	room.generateRecordInfo()
}

function endRoomRecord(room) {
	if (room.records.length == 0) {
		return
	}
	room.records.filter(r => r.success).forEach(r => {
		let {
			rid,
			scores,
			pais,
			dingques,
			actions,
			gameresult,
			gamenum,
			junum
		} = r
		roomDao.insertRecore({
			rid,
			scores,
			pais,
			dingques,
			actions,
			gameresult,
			gamenum,
			junum
		})
	})
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
	endRoomRecord(room)
	let users = []
	for (let seat of room.seats) {
		if (seat.userid > 0) {
			users.push(seat.userid)
			delUid(seat.userid)
			await userDao.updateRoomID(seat.userid, '')
		}
	}
	room.dissolved = true
	setTimeout(() => {
		delRoom(rpid)
	}, 600000)
	if (room.state == 0) {
		await userDao.addCardNum(room.createUid, room.rule.numOfJu)
	}
	return users
}

async function finishRoom(rpid) {
	let room = getRoom(rpid)
	endRoomRecord(room)
	await recordRoomResult(room)
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

async function recordRoomResult(room) {
	let results = room.seats.map(s => s.roomResult.sum)
	await roomDao.updateRoomResult(room.rid, JSON.stringify(results))
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

function getTimeString() {
	const now = new Date()
	return `${now.getFullYear()}-${now.getMonth() +
		1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

module.exports = {
	transformRoomInfo,
	createRoom,
	preEnterRoom,
	joinRoom,
	exitRoom,
	startRoom,
	startRoomRecord,
	dissolveRoom,
	finishRoom,
	getRoomForUserId,
	isMatched,
	isRoomValid,
	getRoomsForQps,
	getRoom,
	recordRoomResult
}

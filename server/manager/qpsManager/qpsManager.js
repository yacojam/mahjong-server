const UserDao = require('../../db/UserDao')
const QpsDao = require('../../db/QpsDao')
const MsgDao = require('../../db/MsgDao')
const Qipaishi = require('./qpsInfo')
const connectionManager = require('../connectionManager/connectionManager')
const qpsFomatter = require('./qpsMsgFomatter')
const UserType = {
	OFF: 0, //离线
	ON: 1, //在线
	GAME: 2 //游戏
}

let QPSMap = {}
let user2ids = {}

async function start() {
	let allQpsData = await QpsDao.getAllQps()
	if (allQpsData && allQpsData.length > 0) {
		for (let data of allQpsData) {
			let qps = new Qipaishi(data)
			let allQpsUserids = await QpsDao.getAllUserIds(data.qpsid)
			for (let userData of allQpsUserids) {
				await addUser(qps, userData.userid)
				if (userData.iscreator) {
					qps.creator = userData.userid
				}
			}
			await _runQps(qps)
			QPSMap[data.qpsid] = qps
		}
	}
}

async function _runQps(qps) {
	let rets = []
	for (let i = 0; i < 2; i++) {
		let ret = await createRoomForQps(qps)
		if (ret.code != 0) {
			return rets
		} else {
			rets.push(ret.data.room)
		}
	}
	return rets
}

async function getAllQps(userid) {
	let qpsArray = await QpsDao.getAllQpsIds(userid)
	if (qpsArray && qpsArray.length > 0) {
		return qpsArray.map(qps => getQps(qps.qpsid))
	}
	return []
}

async function createRoomForQps(qps) {
	let roomManager = require('../roomManager/roomManager')
	let ret = await roomManager.createRoom(qps.creator, qps.rules, qps.qpsid)
	if (ret.code != 0) {
		qps.running = false
	} else {
		let { roomPresentId, conf } = ret.data.room
		let users = []
		let userids = qps.users
			.filter(u => u.onlineType == 1)
			.map(u => u.userid)
		userids.forEach(uid => {
			connectionManager.sendMessage(uid, 'qps_room_created', {
				rpid: roomPresentId,
				conf,
				users
			})
		})
	}
	return ret
}

async function canCreateQps(userid) {
	let cardNum = await UserDao.getCardNum(userid)
	if (cardNum < 1000) {
		//房卡不够
		return 1
	}
	let qps = await QpsDao.qpsCreatedBy(userid)
	if (qps && qps.length === 2) {
		//创建的棋牌室超过总数
		return 2
	}
	return 0
}

async function createQps(userid, qpsname, weixin, qpsnotice, rules) {
	let ret = {}
	let qpsid = getValidQpsID()
	let data = {
		qpsid,
		qpsname,
		weixin,
		qpsnotice,
		rules: JSON.stringify(rules)
	}
	await QpsDao.createQps(data)
	await QpsDao.insertRelation({
		userid,
		qpsid,
		iscreator: true
	})
	QPSMap[qpsid] = new Qipaishi(data)
	QPSMap[qpsid].creator = userid
	addUser(QPSMap[qpsid], userid)
	await _runQps(QPSMap[qpsid])
	return QPSMap[qpsid]
}

function generateRandomId() {
	var qid = ''
	for (var i = 0; i < 6; i++) {
		qid += Math.floor(Math.random() * 10)
	}
	return qid
}

function getValidQpsID() {
	let qid = generateRandomId()
	if (isValid(qid)) {
		return getValidQpsID()
	}
	return qid
}

function isValid(qid) {
	return QPSMap[qid] != null
}

async function activeQps(userid, qpsid) {
	let qps = QPSMap[qpsid]
	if (qps.running) {
		return true
	}
	let cardNum = await UserDao.getCardNum(userid)
	if (cardNum < 300) {
		return false
	}
	let rets = await _runQps(qps)
	qps.running = true
	return true
}

async function updateQps(qpsid, qpsData) {
	let qps = QPSMap[qpsid]
	qps.update(qpsData)
	qpsData.rules = JSON.stringify(qpsData.rules)
	await QpsDao.updateQps(qpsid, qpsData)
}

async function deleteQps(userid, qpsid) {
	let ret = {}
	let qps = QPSMap[qpsid]
	let userids = qps.users.filter(u => u.onlineType == 1).map(u => u.userid)
	userids.forEach(uid => {
		delete user2ids[uid]
		connectionManager.sendMessage(uid, 'qps_deleted', { qpsid })
	})
	delete QPSMap[qpsid]
	await QpsDao.deleteQps(qpsid)
	await QpsDao.deleteQpsAllRelation(qpsid)
	await QpsDao.deleteQpsAllMsg(qpsid)
}

async function exitQps(userid, qpsid) {
	let ret = {}
	let qps = QPSMap[qpsid]
	await deleteUser(qps, userid)
	await QpsDao.deleteRelation(userid, qpsid)
	ret.code = 0
	ret.data = { qps }
	return ret
}

async function joinQpsRequest(userid, qpsid) {
	let qps = QPSMap[qpsid]
	const applys = (await QpsDao.getMyApply(userid, qpsid)) || []
	let isExist = applys.find(apply => {
		// 我申请过，且申请还未被处理
		return apply.senderid == userid && apply.state == 0
	})
	if (isExist) {
		return -1
	}
	const userData = await UserDao.getUserDataByUserid(userid)
	let applyData = await QpsDao.addApply(userid, userData.name, qpsid)

	// 通知棋牌室管理员
	await MsgDao.insertMsg(qpsFomatter.format(applyData, qps, qps.creator))
}

async function agreeJoinQpsRequest(aid, userid) {
	const apply = await QpsDao.applyOfId(aid)

	let qps = QPSMap[apply.qpsid]
	if (qps == null || qps.creator != userid) {
		return -1
	}
	if (qps.getUser(apply.senderid) != null) {
		return -2
	}
	if (qps.users.length >= 500) {
		return -3
	}

	await QpsDao.acceptApply(aid)
	await addUser(qps, apply.senderid)
	await QpsDao.insertRelation({
		userid: apply.senderid,
		qpsid: apply.qpsid,
		iscreator: false
	})
	 
	// 通知申请人
	await MsgDao.insertMsg(qpsFomatter.format(apply, qps, apply.senderid))
}

async function rejectJoinQpsRequest(aid, userid) {
	const apply = await QpsDao.applyOfId(aid)

	let qps = QPSMap[apply.qpsid]
	if (qps == null || qps.creator != userid) {
		return -1
	}

	await QpsDao.refuseApply(aid)
	// 通知申请人
	await MsgDao.insertMsg(qpsFomatter.format(apply, qps, apply.senderid))
}

//进入qps
function connectQps(userid, qpsid) {
	let ret = {}
	let qps = QPSMap[qpsid]
	if (qps == null) {
		ret.code = 1
		return ret
	}
	let user = qps.getUser(userid)
	if (user == null) {
		ret.code = 1
		return ret
	}
	user.onlineType = 1
	user2ids[userid] = qpsid
	ret.code = 0
	ret.data = { qps }
	return ret
}

function disconnectQps(userid) {
	let ret = {}
	let qpsid = user2ids[userid]
	let qps = QPSMap[qpsid]
	qps.getUser(userid).onlineType = 0
	ret.code = 0
	ret.data = { qps }
	delete user2ids[userid]
	return ret
}

function getQps(qpsid) {
	return QPSMap[qpsid] || null
}

async function addUser(qps, userid) {
	let userData = await UserDao.getUserDataByUserid(userid)
	let { name, headimg } = userData
	let onlineType = 0
	qps.users.push({ userid, name, headimg, onlineType })
}

async function deleteUser(qps, userid) {
	qps.users = qps.users.filter(u => u.userid != userid)
}

async function getApplyRecords(userid) {
	return await QpsDao.getMyApply(userid)
}

module.exports = {
	start,
	getAllQps,
	canCreateQps,
	createQps,
	updateQps,
	getQps,
	deleteQps,
	exitQps,
	joinQpsRequest,
	agreeJoinQpsRequest,
	rejectJoinQpsRequest,
	createRoomForQps,
	connectQps,
	disconnectQps,
	getApplyRecords
}

//createQps('100008', '和县麻将', '和谐游戏', [[0], [0], [0], [0]])
//agreeJoinQpsRequest('100007', '163130')

const UserDao = require('../../db/UserDao')
const QpsDao = require('../../db/QpsDao')
const Qipaishi = require('./qpsInfo')
const UserType = {
	OFF: 0, //离线
	ON: 1, //在线
	GAME: 2 //游戏
}

let QPSMap = {}
let user2ids = {}
let createRoomFunc = null

async function start(func) {
	createRoomFunc = func
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
	for (let i = 0; i < 2; i++) {
		let ret = await createRoomForQps(qps)
		if (ret.code != 0) {
			return false
		}
	}
	return true
}

async function createRoomForQps(qps) {
	let ret = await createRoomFunc(qps.creator, qps.rules, qps.qpsid)
	if (ret.code != 0) {
		qps.running = false
	}
	return ret
}

async function canCreateQps(userid) {
	let cardNum = await UserDao.getCardNum(userid)
	if (cardNum < 1000) {
		//房卡不够
		return 1
	}
	let qps = await QpsDao.getAllQpsIds()
	if (qps && qps.length > 4) {
		//创建和加入的棋牌室总数超过限制
		return 2
	}
	return 0
}

async function createQps(userid, qpsname, qpsnotice, rules) {
	let ret = {}
	let qpsid = getValidQpsID()
	let data = {
		qpsid,
		qpsname,
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
	await _runQps(qps)
	qps.running = true
	return true
}

async function updateQps(qpsid, qpsData) {
	await QpsDao.updateQps(qpsid, qpsData)
	let qps = QPSMap[qpsid]
	qps.update(qpsData)
}

async function deleteQps(userid, qpsid) {
	let ret = {}
	let qps = QPSMap[qpsid]
	let userids = qps.users.filter(u => u.onlineType == 1).map(u => u.userid)
	userids.forEach(uid => {
		delete user2ids[uid]
	})
	delete QPSMap[qpsid]
	await QpsDao.deleteQps(qpsid)
	await QpsDao.deleteQpsAllRelation(qpsid)
	await QpsDao.deleteQpsAllMsg(qpsid)
	ret.code = 0
	ret.data = { userids }
}

async function joinQpsRequest(userid, qpsid) {
	let ret = {}
	let qps = QPSMap[qpsid]
	if (!qps) {
		//棋牌室不存在
		ret.code = 1
		return ret
	}
	if (qps.users.some(user => user.userid == userid)) {
		//已经在棋牌室里面了
		ret.code = 2
		return ret
	}
	if (qps.users.length >= 500) {
		//已满
		ret.code = 3
		return ret
	}
	let isExist = await QpsDao.getJoinMsg(userid, qpsid)
	if (isExist) {
		ret.code = 4
		return ret
	}
	await QpsDao.insertJoinMsg({
		userid,
		qpsid
	})
	ret.code = 0
	return ret
}

async function agreeJoinQpsRequest(userid, qpsid, creator) {
	let ret = {}
	let qps = QPSMap[qpsid]
	if (!qps || qps.creator != creator) {
		//棋牌室不存在或者创建者不一致
		ret.code = 1
		return ret
	}
	if (qps.users.some(user => user.userid == userid)) {
		//已经在棋牌室里面了
		ret.code = 2
		return ret
	}
	if (qps.users.length >= 500) {
		//已满
		ret.code = 3
		return ret
	}
	await QpsDao.handleJoinMsg(userid, qpsid)
	await addUser(qps, userid)
	await QpsDao.insertRelation({
		userid,
		qpsid,
		iscreator: false
	})
	ret.code = 0
	ret.data = { qps }
	return ret
}

async function rejectJoinQpsRequest(userid, qpsid, creator) {
	let ret = {}
	let qps = QPSMap[qpsid]
	if (!qps || qps.creator != creator) {
		//棋牌室不存在或者创建者不一致
		ret.code = 1
		return ret
	}
	await QpsDao.handleJoinMsg(userid, qpsid)
	ret.code = 0
	ret.data = { qps }
	return ret
}

async function exitQps(userid, qpsid) {
	let ret = {}
	let qps = QPSMap[qpsid]
	if (!qps) {
		//棋牌室不存在
		ret.code = 1
		return ret
	}
	await deleteUser(qps, userid)
	await QpsDao.deleteRelation(userid, qpsid)
	ret.code = 0
	ret.data = { qps }
	return ret
}

//进入qps
async function connectQps(userid, qpsid) {
	let ret = {}
	let qpsId = await QpsDao.getQpsForUserid(userid, qpsid)
	if (!qpsId) {
		//参数不对
		ret.code = 1
		return ret
	}
	let qps = QPSMap[qpsid]
	qps.getUser(userid).onlineType = 1
	user2ids[userid] = qpsid
	ret.code = 0
	ret.data = { qps }
	return ret
}

function disconnectQps(userid) {
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
	let { userid, name, headimg } = userData
	let onlineType = 0
	qps.users.push({ userid, name, headimg, onlineType })
}

async function deleteUser(qps, userid) {
	qps.users = qps.users.filter(u => u.userid != userid)
}

module.exports = { canCreateQps, createQps, updateQps, getQps }

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

async function start() {
	let allQpsData = await QpsDao.getAllQps()
	if (allQpsData && allQpsData.length > 0) {
		for (let data of allQpsData) {
			QPSMap[data.qpsid] = new Qipaishi(data)
			let allQpsUserids = await QpsDao.getAllUserIds(data.qpsid)
			for (let userid of allQpsUserids) {
				await addUser(QPSMap[data.qpsid], userid)
			}
		}
	}
}

async function canCreateQps(userid) {
	let cardNum = await UserDao.getCardNum(userid)
	if (cardNum < 500) {
		return false
	}
	let qps = await QpsDao.getCreatedQps()
	if (qps) {
		return false
	}
	return true
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

async function activeQps(userid, qpsid) {}

async function createQps(userid, qpsname, qpsnotice, rules) {
	let ret = {}
	let canCreate = await canCreate(userid)
	if (!canCreate) {
		ret.code = 1
		return ret
	}
	let qpsid = getValidQpsID()
	let data = {
		qpsid,
		qpsname,
		qpsname,
		rules: JSON.stringify(rules)
	}
	await QpsDao.createQps(data)
	await QpsDao.insertRelation({
		userid,
		qpsid,
		iscreator: true
	})
	QPSMap[qpsid] = new Qipaishi(data)
	addUser(QPSMap[qpsid], userid)
}

async function updateQps(qpsid, qpsData) {
	let ret = {}
	await QpsDao.updateQps(qpsid, qpsData)
	let qps = QPSMap[qpsid]
	qps.update(qpsData)
	ret.code = 0
	return ret
}

async function deleteQps(userid, qpsid) {
	let ret = {}
	let qpsIdData = await QpsDao.getQpsForUserid(userid, qpsid)
	if (!qpsIdData || !qpsIdData.iscreator) {
		//参数不对
		ret.code = 1
		return ret
	}
	let qps = QPSMap[qpsid]
	let userids = qps.users.filter(u => u.onlineType == 1).map(u => u.userid)
	userids.forEach(uid => {
		delete user2ids[uid]
	})
	delete QPSMap[qpsid]
	await QpsDao.deleteQps(qpsid)
	await QpsDao.deleteQpsAllRelation(qpsid)
	ret.code = 0
	ret.data = { userids }
}

async function joinQps(userid, qpsid) {
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
	userData.onlineType = 0
	qps.users.push(userData)
}

async function deleteUser(qps, userid) {
	qps.users = qps.users.filter(u => u.userid != userid)
}

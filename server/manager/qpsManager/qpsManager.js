const UserDao = require('../db/UserDao')
const QpsDao = require('../../db/QpsDao')
const Qipaishi = require('./qpsInfo')

let QPSMap = {}
let user2ids = {}

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

function getValidQpsID() {}

async function createQps(userid, qpsname, qpsnotice, rules) {}

async function updateQps(qpsData) {}

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

async function disconnectQps(userid, qpsid) {
	let qps = QPSMap[qpsid]
	qps.getUser(userid).onlineType = 0
	ret.code = 0
	ret.data = { qps }
	delete user2ids[userid]
	return ret
}

async function start() {
	let allQpsData = await QpsDao.getAllQps()
	if (allQpsData && allQpsData.length > 0) {
		allQpsData.forEach(data => {
			QPSMap[data.qpsid] = new Qipaishi(data)
		})
	}
}

async function addUser(qps, userid) {
	let userData = await UserDao.getUserDataByUserid(userid)
	userData.onlineType = 0
	qps.users.push(userData)
}

async function deleteUser(qps, userid) {
	qps.users = qps.users.filter(u => u.userid != userid)
}

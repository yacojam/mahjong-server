const UserDao = require('../db/UserDao')
const QpsDao = require('../../db/QpsDao')
import Qipaishi from './qpsInfo'

let QPSMap = {}

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

async function deleteQps(id) {}

async function start() {
	let allQpsData = await QpsDao.getAllQps()
	if (allQpsData && allQpsData.length > 0) {
		allQpsData.forEach(data => {
			QPSMap[data.qpsid] = new Qipaishi(data)
		})
	}
}

const DBBase = require('./DBBase')

function createQps(data) {
	return DBBase.insert('nv_qps', data)
}

function getQpsData(qpsid) {
	return DBBase.select('nv_qps', `qpsid='${qpsid}'`)
}

function getAllQps() {
	return DBBase.selectAll('nv_qps')
}

function insertRelation(data) {
	return DBBase.insert('nv_qps_user', data)
}

function getAllQpsIds(userid) {
	return DBBase.selectAll('nv_qps_user', `userid='${userid}'`)
}

function getAllUserIds(qpsid) {
	return DBBase.selectAll('nv_qps_user', `qpsid='${qpsid}'`)
}

function getQpsForUserid(userid, qpsid) {
	return DBBase.select(
		'nv_qps_user',
		`userid='${userid}' and qpsid='${qpsid}'`
	)
}

module.exports = {
	createQps,
	getQpsData,
	insertRelation,
	getAllQpsIds,
	getAllUserIds,
	getQpsForUserid
}

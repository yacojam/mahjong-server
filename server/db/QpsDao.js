const DBBase = require('./DBBase')

function createQps(data) {
	return DBBase.insert('nv_qps', data)
}

function getQpsData(qpsid) {
	return DBBase.select('nv_qps', `qpsid='${qpsid}'`)
}

function deleteQps(qpsid) {
	return DBBase.deleteWhere('nv_qps', `qpsid='${qpsid}'`)
}

function updateQps(qpsid, data) {
	return DBBase.update('nv_qps', data, `qpsid='${qpsid}'`)
}

function getAllQps() {
	return DBBase.selectAll('nv_qps')
}

function deleteQpsAllRelation(qpsid) {
	return DBBase.deleteWhere('nv_qps_user', `qpsid='${qpsid}'`)
}

function insertRelation(data) {
	return DBBase.insert('nv_qps_user', data)
}

function deleteRelation(userid, qpsid) {
	return DBBase.deleteWhere(
		'nv_qps_user',
		`userid='${userid}' and qpsid='${qpsid}'`
	)
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
	getQpsForUserid,
	getAllQps
}

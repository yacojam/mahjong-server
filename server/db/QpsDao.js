const DBBase = require('./DBBase')

const TB_QPS_APPLY = 'qps_apply'

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

function qpsCreatedBy(userid) {
	return DBBase.selectAll(
		'nv_qps_user',
		`userid='${userid}' and iscreator='1'`
	)
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

async function getMyApply(userid, qpsid) {
	const myQps = await qpsCreatedBy(userid)
	if (myQps) {
		const inWhich = myQps.map(qps=>{
			return `'${qps.qpsid}'`
		}).join(',')
		const applies = await DBBase.selectAll(TB_QPS_APPLY, `senderid='${userid}' or qpsid in (${inWhich})`)
		return applies
	} else {
		return await DBBase.selectAll(TB_QPS_APPLY, `senderid='${userid}'`)
	}
}

function applyOfId(aid) {
	return DBBase.select(TB_QPS_APPLY, `id=${aid}`)
}

async function addApply(userid, username, qpsid) {
	await DBBase.insert(TB_QPS_APPLY, { senderid: userid, sendername: username, qpsid: qpsid, state: 0 })
	return DBBase.select(TB_QPS_APPLY, `senderid='${userid}' and qpsid='${qpsid}' and state='0'`)
}

function acceptApply(aid) {
	return DBBase.update(TB_QPS_APPLY, {state: 1}, `id=${aid}`)
}

function refuseApply(aid) {
	return DBBase.update(TB_QPS_APPLY, {state: -1}, `id=${aid}`)
}

module.exports = {
	createQps,
	getQpsData,
	insertRelation,
	getAllQpsIds,
	getAllUserIds,
	getQpsForUserid,
	getAllQps,
	deleteRelation,
	updateQps,
	qpsCreatedBy,
	getMyApply,
	applyOfId,
	addApply,
	acceptApply,
	refuseApply
}

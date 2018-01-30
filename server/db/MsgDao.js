const DBBase = require('./DBBase')

function insertQpsJoinMsg(userid, qpsid) {
	return DBBase.insert('nv_msg', { userid, content: qpsid, type: 1 })
}

function handleQpsJoinMsg(userid, qpsid) {
	return DBBase.deleteWhere(
		'nv_msg',
		`userid='${userid}' and content='${qpsid}' and type='1'`
	)
}

function getQpsJoinMsg(userid, qpsid) {
	return DBBase.select(
		'nv_msg',
		`userid='${userid}' and content='${qpsid}' and type='1'`
	)
}

function deleteQpsAllMsg(qpsid) {
	return DBBase.deleteWhere('nv_msg', `content='${qpsid}' and type='1'`)
}

module.exports = {
	insertQpsJoinMsg,
	getQpsJoinMsg,
	handleQpsJoinMsg,
	deleteQpsAllMsg
}

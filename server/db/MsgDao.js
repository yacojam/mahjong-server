const DBBase = require('./DBBase')

function insertMsg(msg) {
	return DBBase.insert('nv_msg', msg)
}

function updateState(mid, state) {
	return DBBase.update(
		'nv_msg', {
			state: state
		}, 
		`id='${mid}'`
	)
}

function getMsgsOfUser(userid) {
	return DBBase.selectAll(
		'nv_msg',
		`toid='${userid}'`,
		null, 
		'id desc'
	)
}

function deleteMsg(mid) {
	return DBBase.deleteWhere('nv_msg', `id='${mid}'`)
}

module.exports = {
	insertMsg,
	updateState,
	getMsgsOfUser,
	deleteMsg
}

const qpsManager = require('../qpsManager/qpsManager')
const MsgDao = require('../../db/MsgDao')

// 目前仅棋牌室申请消息
async function getUserMessages(userid) {
	const msgs = await MsgDao.getMsgsOfUser(userid) || []
	let applyRecords = await qpsManager.getApplyRecords(userid) || []
	msgs.forEach(m=>{
		if (m.type == 1 || m.type == 2) {
			m.extra = applyRecords.find(r=>r.id === m.dataid)
		}
	})

	return msgs
}

async function insertMessage(msg) {
	await MsgDao.insertMsg(msg)
}

async function updateState(id, state) {
	await MsgDao.updateState(id, state)
}

async function deleteMessage(id) {
	await MsgDao.deleteMsg(id)
}

module.exports = {
	getUserMessages,
	insertMessage,
	updateState,
	deleteMessage
}
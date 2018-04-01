const QpsDao = require('../../db/QpsDao')
const MsgDao = require('../../db/MsgDao')

// 目前仅棋牌室申请消息
async function getUserMessages(userid) {
	const msgs = await MsgDao.getMsgsOfUser(userid) || []
	let applyRecords = await QpsDao.getMyApply(userid) || []
	msgs.forEach(m=>{
		if (m.type == 1 || m.type == 2) {
			m.extra = applyRecords.find(r=>r.id === m.dataid)
		}
	})

	return msgs
}

async function sendMessage(msg) {
	await MsgDao.insertMsg(msg)
}

async function updateState(id, state) {
	await MsgDao.updateState(id, state)
}

async function deleteMessage(id) {
	await MsgDao.deleteMsg(id)
}

async function deleteDataRelatedMsg(types, dataid) {
	if (types instanceof Array) {
		await MsgDao.deleteMsgWhere(`type in (${types.join(',')}) where dataid=${dataid}`)
	} else {
		await MsgDao.deleteMsgWhere(`type=${types} where dataid=${dataid}`)
	}
}

async function getLastMsg(userid) {
	return await MsgDao.getLastMsg(userid)
}

module.exports = {
	getUserMessages,
	sendMessage,
	updateState,
	deleteDataRelatedMsg,
	getLastMsg
}
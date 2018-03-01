const qpsManager = require('../qpsManager/qpsManager')
const MsgDao = require('../../db/MsgDao')
const qpsFomatter = require('./qpsMsgFomatter')

// 目前仅棋牌室申请消息
async function getUserMessages(userid) {
	let applyRecords = await qpsManager.getApplyRecords(userid) 
	if (!applyRecords) {
		return []
	} 
	return applyRecords.map(apply=>{
		return qpsFomatter.format(apply, userid)
	})
}

module.exports = {
	getUserMessages
}
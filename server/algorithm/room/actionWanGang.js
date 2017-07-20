const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
const Pend = require('../HxmjRules/pendingtype')

async function wangang(action) {
	const { user, room, pai } = action
	const users = room.users
	user.gangPais.push(pai)
	user.pengPais = utils.removePai(user.pengPais, pai)
	user.shouPais = utils.removePai(user.shouPais, pai)
	room.pendingType = Pend.PENDING_TYPE_NULL
	await utils.otherUserAction(room, Action.ACTION_WGANG, pai, true)
	return room
}

module.exports = wangang

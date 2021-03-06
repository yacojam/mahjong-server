// peng
const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
const Pend = require('../HxmjRules/pendingtype')

async function peng(action) {
	const { user, room, pai } = action
	user.pengPais.push(pai)
	user.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
	user.shouPais = utils.removePai(user.shouPais, pai, 2)
	room.users[room.index].chuPais.pop()
	room.index = room.users.findIndex(u => u.uid === user.uid)
	room.pendingType = Pend.PENDING_TYPE_NULL
	return room
}

module.exports = peng

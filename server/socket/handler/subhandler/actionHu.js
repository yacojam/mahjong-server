const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function hu(room, seat, action) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	const { pengPais, gangPais, anGangPais, shouPais, que } = seat
	let allChupais = []
	room.seats.forEach(u => {
		allChupais = allChupais.concat(u.chuPais)
		u.pengPais.forEach(pai => {
			allChupais.push(pai)
			allChupais.push(pai)
			allChupais.push(pai)
		})
	})
	const scores = HXMJManager.getScore(
		pengPais,
		gangPais,
		anGangPais,
		shouPais,
		action.pAction,
		action.pai,
		allChupais,
		room.rule,
		que
	)

	await Publish.publishHuAction(room, seat, action)
	currentUser.score = score
	room.state = 'DONE'
}

module.exports = hu

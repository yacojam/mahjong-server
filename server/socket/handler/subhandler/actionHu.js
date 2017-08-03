const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')
const RoomState = Next.RoomState

async function hu(room, seat, action) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	room.index = room.seats.findIndex(u => u.userid === seat.userid)
	room.dealerIndex = room.index
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
	// const scores = HXMJManager.getScore(
	// 	pengPais,
	// 	gangPais,
	// 	anGangPais,
	// 	shouPais,
	// 	action.pAction,
	// 	action.pai,
	// 	allChupais,
	// 	room.rule,
	// 	que
	// )
	const scores = [20, 0]
	let isZimo =
		action.pAction === Action.ACTION_ZIMO ||
		action.pAction === Action.ACTION_GSHUA
	await endGameWithHu(room, seat, scores, isZimo, action.pai)
}

async function endGameWithHu(room, seat, scores, isZimo, pai) {
	let ret = {}
	seat.moMoney = 3 * scores[1] * room.rule.dfOfJu / 5
	if (!isZimo) {
		seat.shouPais.push(pai)
	}
	let isOver = false
	let isNa = true
	room.seats.forEach(s => {
		s.ready = false
		if (s.userid !== seat.userid) {
			if (s.score > scores[0]) {
				seat.score += scores[0]
				s.score -= scores[0]
				isNa = false
			} else {
				seat.score += s.score
				s.score = 0
				isOver = true
			}
			s.moMoney -= scores[1] * room.rule.dfOfJu / 5
		}
	})

	ret.gameRet = room.seats.map(s => {
		let { userid, index, shouPais, moMoney, score } = s
		return { userid, index, shouPais, moMoney, score }
	})
	room.state = RoomState.GAMEOVER
	if (isOver) {
		ret.juRet = room.seats.map(s => {
			let { userid, index, score, moMoney } = s
			let isScoreWin = score - 50 > 0
			let scoreMoney = Math.round(
				Math.abs(score - 50) * room.rule.dfOfJu / 50.0
			)
			if (!isScoreWin) {
				scoreMoney = 0 - scoreMoney
			}
			let naMoney = 0
			if (isNa) {
				if (room.currentGame == 1) {
					if (s.userid === seat.userid) {
						naMoney = dfOfJu * 3
					} else {
						naMoney = 0 - dfOfJu
					}
				} else {
					if (s.userid === seat.userid) {
						naMoney = dfOfJu * 3 / 5 * 3
					} else {
						naMoney = 0 - dfOfJu * 3 / 5
					}
				}
			}
			let sum = moMoney + scoreMoney + naMoney
			return { userid, index, score, moMoney, scoreMoney, naMoney }
		})
		room.result.push(JuRet)
		if (room.currentJu === room.rule.numOfJu) {
			room.state = RoomState.ROOMOVER
			ret.roomRet = room.result
		} else {
			room.state = RoomState.JUOVER
		}
	}
	ret.state = room.state

	await Publish.publishHuAction(room, seat, ret)
}

module.exports = hu

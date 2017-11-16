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
	let oldIndex = room.index
	room.index = room.seats.findIndex(u => u.userid === seat.userid)
	room.dealerIndex = room.index
	const { pengPais, gangPais, anGangPais, shouPais, que } = seat
	let copyShouPais = shouPais.concat()
	let allChupais = []
	room.seats.forEach(u => {
		allChupais = allChupais.concat(u.chuPais)
		u.pengPais.forEach(pai => {
			allChupais.push(pai)
			allChupais.push(pai)
			allChupais.push(pai)
		})
	})

	console.log('计算')
	console.log('ps' + pengPais)
	console.log('gs' + gangPais)
	console.log('ags' + anGangPais)
	console.log('ss' + copyShouPais)
	console.log('action' + action.pAction)
	console.log('pai' + action.pai)
	console.log('acs' + allChupais)
	console.log('rule' + room.rule)
	console.log('que' + que)
	let isZimo =
		action.pAction === Action.ACTION_ZIMO ||
		action.pAction === Action.ACTION_GSHUA
	if (isZimo) {
		let index = copyShouPais.findIndex(s => s === action.pai)
		copyShouPais.splice(index, 1)
	}
	const scores = HXMJManager.getScore(
		pengPais,
		gangPais,
		anGangPais,
		copyShouPais,
		action.pAction,
		action.pai,
		allChupais,
		room.rule,
		que
	)
	//const scores = [20, 0]
	// if (action.pAction === Action.ACTION_PAOHU) {
	// 	//炮胡，需要将出牌的一方pop
	// 	room.seats[oldIndex].chuPais.pop()
	// }
	// if (action.pAction === Action.ACTION_QGHU) {
	// 	let gangPais = room.seats[oldIndex].gangPais
	// 	let paiIndex = gangPais.findIndex(s => s === action.pai)
	// 	gangPais.splice(paiIndex, 1)
	// }
	await endGameWithHu(room, seat, scores, isZimo, action.pai, action)
}

async function endGameWithHu(room, seat, scores, isZimo, pai, action) {
	if (!isZimo) {
		seat.shouPais.push(pai)
	}
	let isOver = false
	let isNa = true
	let winScore = 0
	room.seats.forEach(s => {
		s.ready = false
		s.gameResult = {}
		s.gameResult.originScore = s.score
		s.gameResult.originMo = s.moMoney
		if (s.userid !== seat.userid) {
			if (s.score > scores[0]) {
				winScore += scores[0]
				s.score -= scores[0]
				s.gameResult.deltaScore = -scores[0]
				isNa = false
			} else {
				winScore += s.score
				s.gameResult.deltaScore = -s.score
				s.score = 0
				isOver = true
			}
			s.gameResult.score = s.score
			s.moMoney -= scores[1] * room.rule.dfOfJu / 5
			s.gameResult.deltaMo = -scores[1] * room.rule.dfOfJu / 5
		}
	})
	seat.gameResult.deltaScore = winScore
	seat.gameResult.deltaMo = 3 * scores[1] * room.rule.dfOfJu / 5
	seat.score += winScore
	seat.gameResult.score = seat.score
	seat.moMoney += 3 * scores[1] * room.rule.dfOfJu / 5
	room.state = RoomState.GAMEOVER
	// 一刀结束
	if (isOver) {
		room.seats.forEach(s => {
			let { score, moMoney } = s
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
						naMoney = room.rule.dfOfJu * 3
					} else {
						naMoney = 0 - room.rule.dfOfJu
					}
				} else {
					if (s.userid === seat.userid) {
						naMoney = room.rule.dfOfJu * 3 / 5 * 3
					} else {
						naMoney = 0 - room.rule.dfOfJu * 3 / 5
					}
				}
			}
			let sum = moMoney + scoreMoney + naMoney
			s.juResult = { score, moMoney, naMoney, sum, scoreMoney }
			if (s.roomResult) {
				s.roomResult.score += score
				s.roomResult.moMoney += moMoney
				s.roomResult.naMoney += naMoney
				s.roomResult.sum += sum
				s.roomResult.scoreMoney += scoreMoney
			} else {
				s.roomResult = s.juResult
			}
		})

		if (room.currentJu === room.rule.numOfJu) {
			room.state = RoomState.ROOMOVER
		} else {
			room.state = RoomState.JUOVER
		}
	}
	await Publish.publishHuAction(room, seat, action)
}

module.exports = hu

const connectionManager = require('../connectionManager')

async function publishGameStart(room) {
	console.log('send game start info')
	let { currentJu, currentGame, dealerIndex, state, index } = room
	let seatsData = room.seats.map(s => {
		let { score, moMoney, index, userid } = s
		return { score, moMoney, index, userid }
	})
	room.seats.forEach(seat => {
		let { shouPais, score, moMoney } = seat
		connectionManager.sendMessage(seat.userid, 'game_start_push', {
			state,
			shouPais,
			currentJu,
			currentGame,
			dealerIndex,
			seatsData,
			leftNum: room.leftPais.length,
			index
		})
	})
}

async function publishDingQue(room) {
	console.log('send dingque actions')
	room.seats.forEach(seat => {
		connectionManager.sendMessage(seat.userid, 'dingque_action', {})
	})
}

async function publishDingqueResult(room) {
	let ret = room.seats.map(seat => {
		let { que, index, userid } = seat
		return { que, index, userid }
	})
	room.seats.forEach(seat => {
		connectionManager.sendMessage(seat.userid, 'dingque_result', ret)
	})
}

async function sendActions(room, seat) {
	connectionManager.sendMessage(seat.userid, 'game_actions', {
		actions: seat.actions
	})
}

async function publishChuAction(room, seat, cPai) {
	room.seats.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'game_chu_push', {
			index: room.index,
			userid: seat.userid,
			pai: cPai
		})
	})
}

async function publishMoAction(room, seat, moPai) {
	room.seats.forEach(seatItem => {
		let data = { index: room.index, userid: seat.userid }
		if (seat.userid === seatItem.userid) {
			data.pai = moPai
		}
		connectionManager.sendMessage(seatItem.userid, 'game_mo_push', data)
	})
}

async function publishPengAction(room, seat, pPai) {
	room.seat.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'game_peng_push', {
			index: room.index,
			userid: seat.userid,
			pai: pPai
		})
	})
}

async function publishAnGangAction(room, seat, gPai) {
	room.seat.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'game_angang_push', {
			index: room.index,
			userid: seat.userid,
			pai: gPai
		})
	})
}

async function publishPGangAction(room, seat, gPai) {
	room.seat.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'game_gang_push', {
			index: room.index,
			userid: seat.userid,
			pai: gPai
		})
	})
}

async function publishWanGangAction(room, seat, gPai) {
	room.seat.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'game_gang_push', {
			index: room.index,
			userid: seat.userid,
			pai: gPai
		})
	})
}

async function publishHuAction(room, seat, action) {}

module.exports = {
	publishGameStart,
	publishDingQue,
	publishDingqueResult,
	sendActions,
	publishChuAction,
	publishMoAction,
	publishPengAction,
	publishAnGangAction,
	publishPGangAction
}

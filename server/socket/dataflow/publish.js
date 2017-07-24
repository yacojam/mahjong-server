const connectionManager = require('../connectionManager')

async function publishDingQue(room) {
	room.seats.forEach(seat => {
		let { actions, shouPais } = seat
		connectionManager.sendMessage(seat.userid, 'dingyue_action', {
			actions,
			shouPais
		})
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

async function startGame(room, seat) {
	connectionManager.sendMessage(seat.userid, 'dealer_start', {
		actions: seat.actions
	})
}

async function publishChuAction(room, seat, action) {
	room.seats.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'user_chu', {
			userid: seat.userid,
			pai: action.pai,
			actions: seatItem.actions
		})
	})
}

async function publishMoAction(room, seat) {
	room.seats.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'user_mo', {})
	})
}

async function publishPengAction(room, seat) {}

async function publishAnGangAction(room, seat) {}

async function publishWanGangAction(room, seat) {}

async function publishPGangAction(room, seat) {}

async function publishHuAction(room, seat, action) {}

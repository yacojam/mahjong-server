const io = require('socket.io-client')

var socket = null

function start() {
	var opts = {
		reconnection: false,
		'force new connection': true,
		transports: ['websocket', 'polling']
	}

	socket = io.connect('http://localhost:9000', opts)

	socket.on('connect', () => {
		console.log('connected')
		socket.emit('user_join', {
			userid: 100002,
			rpid: '143423',
			sign: 'c90b331db0e1925ed2fa0da244e30190'
		})
	})

	socket.on('user_join_result', ret => {
		console.log(socket.userid)
		console.log(ret)
	})

	socket.on('new_user_come', ret => {
		console.log(ret)
	})

	socket.on('user_state_changed', ret => {
		console.log(ret)
	})
}

start()

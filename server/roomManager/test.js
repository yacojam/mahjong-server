const fty = require('./factory')
const roomDao = require('../db/RoomDao')

async function test() {
	var userConfigs = [[0], [0], [1, 3, 5]]
	var ret = await fty.createRoom(100001, 9, userConfigs)
	return ret
}

test().then(async ret => {
	console.log(ret)
	let ret1 = await fty.enterRoom(100002, ret.data.rpid)
	console.log(ret1)

	let ret2 = await fty.enterRoom(100003, ret.data.rpid)
	console.log(ret2)

	let ret3 = await fty.enterRoom(100004, ret.data.rpid)
	console.log(ret3)

	let ret4 = await fty.enterRoom(100005, ret.data.rpid)
	console.log(ret4)
})

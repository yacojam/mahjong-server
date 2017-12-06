const shareRedisDao = require('../redis/shareRedisDao')

let allSharedUserIds = null

async function start() {
	shareRedisDao.getAllSharedUsers().then(data => {
		allSharedUserIds = data
		setCleanTime()
	})
}

//设置每天的0点清理
function setCleanTime() {
	let oneDay = 24 * 60 * 60 * 1000
	let now = new Date()
	let time = now.getTime()
	now.setHours(0)
	now.setMinutes(0)
	now.setSeconds(0)
	now.setMilliseconds(0)
	let deltaTime = now.getTime() + oneDay - time
	setTimeout(() => {
		clean()
		setInterval(() => {
			clean()
		}, oneDay)
	}, deltaTime)
}

function clean() {
	if (allSharedUserIds && allSharedUserIds.length > 0) {
		for (let userid of allSharedUserIds) {
			shareRedisDao.del(userid)
		}
	}
	allSharedUserIds = null
}

function saveIfNotShared(userid) {
	if (allSharedUserIds == null) {
		allSharedUserIds = []
		allSharedUserIds.push(userid)
		shareRedisDao.save(userid)
		return true
	} else {
		let existed = allSharedUserIds.some(id => id == userid)
		if (!existed) {
			allSharedUserIds.push(userid)
			shareRedisDao.save(userid)
		}
		return existed
	}
}

module.exports = { start, saveIfNotShared }

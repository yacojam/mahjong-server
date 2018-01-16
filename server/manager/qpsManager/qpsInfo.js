const UserType = {
	OFF: 0, //离线
	ON: 1, //在线
	GAME: 2 //游戏
}
class Qipaishi {
	constructor(item) {
		this.qid = item.qpsid
		this.name = item.qpsname
		this.notice = item.qpsnotice
		this.rules = JSON.parse(item.rules)
		this.users = []
		this.running = true
		this.start()
	}

	start() {}
}

module.exports = Qipaishi

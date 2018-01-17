class Qipaishi {
	constructor(item) {
		this.qid = item.qpsid
		this.name = item.qpsname
		this.notice = item.qpsnotice
		this.rules = JSON.parse(item.rules)
		this.users = []
		this.running = true
	}

	getUser(userid) {
		return this.users.find(u => u.userid == userid)
	}

	update(item) {
		if (item.name) {
			this.name = item.name
		}
		if (item.notice) {
			this.notice = item.notice
		}
		if (item.rules) {
			this.rules = item.rules
		}
	}
}

module.exports = Qipaishi

class Qipaishi {
	constructor(item) {
		this.qpsid = item.qpsid
		this.qpsname = item.qpsname
		this.qpsnotice = item.qpsnotice
		this.rules = JSON.parse(item.rules)
		this.users = []
		this.running = true
	}

	getUser(userid) {
		return this.users.find(u => u.userid == userid)
	}

	update(item) {
		if (item.qpsname) {
			this.qpsname = item.qpsname
		}
		if (item.qpsnotice) {
			this.qpsnotice = item.qpsnotice
		}
		if (item.rules) {
			this.rules = item.rules
		}
	}
}

module.exports = Qipaishi

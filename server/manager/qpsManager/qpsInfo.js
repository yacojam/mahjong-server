class Qipaishi {
	constructor(item) {
		this.qpsid = item.qpsid
		this.qpsname = item.qpsname
		this.qpsnotice = item.qpsnotice
		this.weixin = item.weixin
		this.rules = JSON.parse(item.rules)
		this.users = []
		this.state = item.state
		this.creator = item.creator
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
		if (item.weixin) {
			this.weixin = item.weixin
		}
	}
}

module.exports = Qipaishi

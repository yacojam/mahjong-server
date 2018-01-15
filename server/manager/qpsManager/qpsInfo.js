export default class Qipaishi {
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

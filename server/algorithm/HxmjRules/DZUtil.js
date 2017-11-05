const CommonRules = require('./CommonRules')
class Util {
	constructor(ss, ps, gs, ags, h) {
		this.ss = ss
		this.ps = ps
		this.gs = gs
		this.ags = ags
		this.h = h
		let tns = getAllTypeNum(ss, ps, gs, h)
		this.qys = isQys(tns)
		this.cys = isCys(tns)
		this.mq = ps.length === ags.length
		this.yyh = isYyh(ss, ps, h)
		this.shn = getSiHeNum(ss, ps, h)
		this.tongs = getTongArr(ss, ps, gs, h)
		this.et = this.tongs.some(e => e === 8)

		this.tns = tns
	}

	getTongScore(dn) {
		if (this.tongs.length > 1 && dn) {
			return 9999
		}
		let tongScore = 0
		if (this.tongs.length == 1) {
			tongScore = this.tongs[0]
		}
		if (this.tongs.length == 2) {
			tongScore = this.tongs[0] + this.tongs[1] + 5
		}
		return tongScore
	}
	getTypeScore(dn) {
		let tns = this.tns
		let ft = [tns[0], tns[1], tns[2], tns[3] + tns[4]]
		ft = ft.filter(e => e > 7)
		if (ft.length == 0) {
			return 0
		} else {
			if (ft.length == 1) {
				return ft[0] - 7
			} else {
				return dn ? 9999 : ft[0] - 7 + ft[1] - 7 + 5
			}
		}
	}
	//获取杠的点数
	getGangScore(gn) {
		if (this.gs.length == 3) {
			return gn ? 9999 : 10
		}
		if (this.gs.length == 2) {
			return 5
		}
		return 0
	}
}

function getTongArr(ss, ps, gs, h) {
	let aps = ss.concat(gs)
	aps.push(h)
	ps.forEach(function(e) {
		aps.push(e)
		aps.push(e)
		aps.push(e)
	})
	var typeNumArr = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	aps.filter(e => e < 40).forEach(e => {
		typeNumArr[e % 10 - 1]++
	})
	return typeNumArr.filter(e => e > 4)
}

function getSiHeNum(ss, ps, h) {
	var num = 0
	aps = ss.concat()
	aps.push(h)
	ps.forEach(e => {
		aps.push(e)
		aps.push(e)
		aps.push(e)
	})
	let ret = []
	aps.forEach(e => {
		if (ret.length === 0 || ret.every(p => p !== e)) {
			if (aps.filter(i => i === e).length === 4) {
				ret.push(e)
			}
		}
	})
	return ret.length
}

function isYyh(ss, ps, h) {
	var pais = ss.concat(ps)
	pais.push(h)
	let ret = pais.every(e => {
		let type = CommonRules.getPaiType(e)
		let isF = type === 4 || type === 5
		let isL = e === 19 || e === 29 || e === 39
		let isX = e === 11 || e === 21 || e === 31
		return isF || isL || isX
	})
	return ret
}

function getAllTypeNum(ss, ps, gs, h) {
	let typeNumArr = [0, 0, 0, 0, 0]
	ss.forEach(e => {
		let type = CommonRules.getPaiType(e)
		typeNumArr[type - 1]++
	})
	ps.forEach(function(e) {
		let type = CommonRules.getPaiType(e)
		typeNumArr[type - 1] += 3
	})
	gs.forEach(e => {
		let type = CommonRules.getPaiType(e)
		typeNumArr[type - 1]++
	})
	typeNumArr[CommonRules.getPaiType(h) - 1]++
	return typeNumArr
}

function isQys(tns) {
	let arr1 = tns.filter(e => e > 0)
	return arr1.length === 1 && tns.findIndex(s => s == arr1[0]) < 3
}

function isCys(arr) {
	var arr1 = arr.filter(function(e, i, a) {
		return e > 0 && i < 3
	})
	var arr2 = arr.filter(function(e, i, a) {
		return e > 0 && i > 2
	})
	if (arr1.length == 1 && arr2.length > 0) {
		return true
	}
	return false
}

module.exports = Util

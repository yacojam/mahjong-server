const CommonRules = require('./CommonRules')
const ThreeInfo = require('./ThreeInfo')
const HPSI = require('./DZHuPaiSliceInfo')

class HuPaiInfo {
	constructor(ss, ps, gs, ags, h) {
		this.ss = ss
		this.ps = ps
		this.gs = gs
		this.ags = ags
		this.h = h
		this.hpsis = getAllCommonHuPaiInfos(ss, ps, gs, ags, h)
	}

	getNumAnLXT(zimo) {
		let type = 0
		this.hpsis.forEach(e => {
			let temp = e.getAnLXTNum(zimo)
			type = temp > type ? temp : type
		})
		return type
	}

	canBigMo(only) {
		return only || this.hpsis.some(e => e.isBigMo(only))
	}

	hasDragon() {
		return this.hpsis.some(e => hasOneDragon())
	}

	getSanDKType(isSF) {
		let type = 0
		this.hpsis.forEach(e => {
			let temp = e.getSanDKType(isSF)
			type = temp > type ? temp : type
		})
		return type
	}

	isPPH() {
		return this.hpsis.some(e => e.pph)
	}

	is4DK(isSF) {
		return this.hpsis.some(e => e.hasSiDK(isSF))
	}

	getScore(tingOnly, zimo, isSF) {
		var highScore = 0
		for (var i = 0; i < this.hpsis.length; i++) {
			//console.log(this.hpsis[i])
			var score = 0
			score += this.hpsis[i].getPairScore(tingOnly, zimo)
			score += this.hpsis[i].hasOneDragon() ? 20 : 0
			score += this.hpsis[i].getLhScore()
			score += this.hpsis[i].getBBScore()
			//console.log('lxtscore: ' + this.hpsis[i].getLXTScore())
			score += this.hpsis[i].getLXTScore()
			let sdk = this.hpsis[i].getSanDKType(isSF)
			score += sdk >= 50 ? 20 : sdk >= 3 ? 10 : 0
			score += this.hpsis[i].pph ? 10 : 0
			if (score > highScore) {
				highScore = score
			}
		}
		console.log(highScore)
		return highScore
	}
}

function getAllCommonHuPaiInfos(ss, ps, gs, ags, h) {
	var ret = []
	let aps = ss.concat()
	aps.push(h)
	aps.sort()
	let plength = aps.length
	for (let i = 0; i < plength; ) {
		let cps = aps.concat()
		if (i < plength - 1 && cps[i] == cps[i + 1]) {
			//console.log('在' + i + '位置上检测到将对 ： ' + cps[i])
			cps.splice(i, 2)
			if (CommonRules.isMatchHuWithoutJiangDui(cps)) {
				//console.log('去除将对后，满足胡牌')
				let tis = analyseThreeInfosWithoutJiangDui(cps) //console.log('3张的信息为：'); // threeInfos.forEach(function(e){ // });
				//     console.log(e.isKanzi + ' ' + e.pai);
				ret.push(new HPSI(aps[i], tis, ps, gs, ags, h))
			}
			let j = i + 2
			while (j < plength) {
				if (aps[i] == aps[j]) {
					j++
				} else {
					break
				}
			}
			i = j
		} else {
			i++
		}
	}
	return ret
}

function analyseThreeInfosWithoutJiangDui(fss) {
	let ret = []
	if (fss.length == 0) {
		return ret
	}
	let ti = null
	if (fss[0] == fss[1] && fss[0] == fss[2]) {
		ti = new ThreeInfo(true, fss[0])
		fss.splice(0, 3)
	} else {
		let p = fss[0]
		ti = new ThreeInfo(false, p)
		fss.splice(0, 1)
		fss.splice(fss.findIndex(e => e === p + 1), 1)
		fss.splice(fss.findIndex(e => e === p + 2), 1)
	}
	ret.push(ti)
	return ret.concat(analyseThreeInfosWithoutJiangDui(fss))
}

module.exports = HuPaiInfo

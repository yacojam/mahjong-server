class HuPaiSliceInfo {
	//将对，三张，碰，杠，暗杠，胡
	constructor(jd, tis, ps, gs, ags, h) {
		this.jd = jd
		this.tis = tis
		this.ps = ps
		this.gs = gs
		this.ags = ags
		this.h = h
		this.Kzs = this.tis.filter(e => e.isKanzi)
		this.Tzs = this.tis.filter(e => !e.isKanzi)
		this.hIKz = this.Kzs.some(e => e.pai === this.h)
		this.hITz = this.Tzs.some(e => {
			let d = this.h - e.pai
			return d < 3 && d >= 0
		})
		this.pph = this.Tzs.length == 0
	}
	//对子点数
	getPairScore(isTingOnly, isZimo) {
		let score = this.ps.length + this.gs.length + this.Kzs.length * 2
		if (isTingOnly && this.hITz) {
			score += 1
			return score
		}
		if (!isZimo && this.hIKz && !this.hITz) {
			score -= 1
		}
		// console.log(this.hIKz + ' ' + this.hITz)
		// console.log('pairscore ' + score)
		return score
	}

	//小连号点数
	getLhScore() {
		if (this.Tzs.length <= 1) {
			return 0
		}
		if (this.Tzs.length == 2) {
			return this.Tzs[1].pai == this.Tzs[0].pai + 3 ? 5 : 0
		}
		let score = 0
		let ret = []
		this.Tzs.forEach((ti, index) => {
			if (ret.every(i => i !== index)) {
				let pushed = false
				for (let index2 = 0; index2 < this.Tzs.length; index2++) {
					let ti2 = this.Tzs[index2]
					let existed = ret.some(i => i === index2)
					if (ti2.pai === ti.pai + 3 && !existed) {
						ret.push(index)
						ret.push(index2)
						break
					}
				}
			}
		})
		if (this.hasOneDragon() && ret.length == 2) {
			return 0
		}
		let num = ret.length / 2
		return num == 0 ? 0 : num == 1 ? 5 : 15
	}

	//梆梆点数
	getBBScore() {
		let has = false
		if (this.Tzs.length > 1) {
			this.Tzs.forEach((ti, index) => {
				let fs = this.Tzs.filter(e => e.pai === ti.pai)
				if (fs.length > 1) {
					has = true
				}
			})
		}
		return has ? 5 : 0
	}

	//老小头点数
	getLXTScore() {
		let allKz = this.ps.concat(this.Kzs.map(e => e.pai))
		let num = 0
		if (allKz.some(e => e === 11) && allKz.some(e => e === 19)) {
			num++
		}
		if (allKz.some(e => e === 21) && allKz.some(e => e === 29)) {
			num++
		}
		if (allKz.some(e => e === 31) && allKz.some(e => e === 39)) {
			num++
		}
		return num == 0 ? 0 : num == 1 ? 5 : 15
	}

	//暗老小num
	getAnLXTNum(isZimo) {
		let allKz = this.ags.concat(this.Kzs.map(e => e.pai))
		let num = 0
		if (allKz.some(e => e === 11) && allKz.some(e => e === 19)) {
			num++
			if ((this.h === 11 || this.h === 19) && !isZimo && !this.hITz) {
				num--
			}
		}
		if (allKz.some(e => e === 21) && allKz.some(e => e === 29)) {
			num++
			if ((this.h === 21 || this.h === 29) && !isZimo && !this.hITz) {
				num--
			}
		}
		if (allKz.some(e => e === 31) && allKz.some(e => e === 39)) {
			num++
			if ((this.h === 31 || this.h === 39) && !isZimo && !this.hITz) {
				num--
			}
		}
		return num
	}

	//一条龙
	hasOneDragon() {
		if (
			this.Tzs.some(e => e.pai === 11) &&
			this.Tzs.some(e => e.pai === 14) &&
			this.Tzs.some(e => e.pai === 17)
		) {
			return true
		}
		if (
			this.Tzs.some(e => e.pai === 21) &&
			this.Tzs.some(e => e.pai === 24) &&
			this.Tzs.some(e => e.pai === 27)
		) {
			return true
		}
		if (
			this.Tzs.some(e => e.pai === 31) &&
			this.Tzs.some(e => e.pai === 34) &&
			this.Tzs.some(e => e.pai === 37)
		) {
			return true
		}
		return false
	}

	//0代表没有三大砍；3代表只有三大砍；3.5代表三大砍带一个头；50代表中发白；50.5代表中发白带一个分头
	getSanDKType(isSF) {
		let allKz = this.ps.concat(this.Kzs.map(e => e.pai))
		if (allKz.length < 3) {
			return 0
		}
		allKz.sort()
		if (allKz.length === 3) {
			return getSubSDKType(allKz, this.jd, isSF)
		}
		let type1 = getSubSDKType(allKz.slice(0, 3), this.jd, isSF)
		let type2 = getSubSDKType(allKz.slice(1), this.jd, isSF)
		return type2 > type1 ? type2 : type1
	}

	hasSiDK(isSF) {
		let allKz = this.ps.concat(this.Kzs.map(e => e.pai))
		if (allKz.length < 3) {
			return 0
		}
		allKz.sort()
		if (allKz[0] < 40) {
			return (
				allKz[1] == allKz[0] + 1 &&
				allKz[2] == allKz[0] + 2 &&
				allKz[3] == allKz[0] + 3
			)
		} else {
			return isSF || (!isSF && allKz[3] === 47)
		}
	}

	isBigMo(only) {
		if (!only) {
			let hITzMiddle = this.Tzs.some(e => this.h - e.pai === 1)
			if (!hITzMiddle) {
				if (this.h === 13 || this.h === 23 || this.h === 33) {
					return this.Tzs.some(e => e.pai + 2 === this.h)
				}
				if (this.h === 17 || this.h === 27 || this.h === 37) {
					return this.Tzs.some(e => e.pai === this.h)
				}
				return false
			}
			return true
		}
		return true
	}
}

function getSubSDKType(ks, jd, isSF) {
	if (ks[0] < 40) {
		if (ks[1] === ks[0] + 1 && ks[2] === ks[0] + 2) {
			if (jd == ks[0] - 1 || jd == ks[2] + 1) {
				return 3.5
			}
			return 3
		}
		return 0
	} else if (ks[0] === 51) {
		if (jd > 40 && isSF) {
			return 50.5
		}
		return 50
	} else {
		if (isSF) {
			return jd > 40 ? 3.5 : 3
		} else {
			if (ks[2] < 50) {
				return jd > 40 && jd < 50 ? 3.5 : 3
			}
			return 0
		}
	}
}

module.exports = HuPaiSliceInfo

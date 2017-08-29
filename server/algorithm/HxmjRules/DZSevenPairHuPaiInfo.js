class HuPaiInfo {
	constructor(ss, h) {
		this.ss = ss
		this.h = h
	}
	getBBNumForSevenPairs(isSF) {
		var num = 0
		var aps = this.ss.concat()
		aps.push(this.h)
		aps.sort()
		let sps = aps.filter((e, i) => i % 2 === 0)
		let mps = sps.map(e => {
			if (e < 40) {
				return e
			} else {
				if (e === 43) {
					return 42
				}
				if (e === 45) {
					return 43
				}
				if (e === 47) {
					return 44
				}
				if (e === 51) {
					return isSF ? 45 : 51
				}
				if (e === 53) {
					return isSF ? 46 : 52
				}
				if (e === 55) {
					return isSF ? 47 : 53
				}
				return e
			}
		})
		let copy = []
		for (var i = 0; i < 5; i++) {
			if (copy.every(e => e !== i)) {
				let f = false
				for (var j = i + 1; j < 6 && !f; j++) {
					if (mps[j] == mps[i] + 1 && copy.every(e => e !== j)) {
						for (var k = j + 1; k < 7 && !f; k++) {
							if (
								mps[k] == mps[j] + 1 &&
								copy.every(e => e !== k)
							) {
								f = true
								copy.push(i)
								copy.push(j)
								copy.push(k)
							}
						}
					}
				}
			}
		}
		num += copy.length / 3
		return num
	}
}

module.exports = HuPaiInfo

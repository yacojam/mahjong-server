class ThreeInfo {
	constructor(isKanzi, pai) {
		this.isKanzi = isKanzi
		this.pai = pai
	}
	isTangWithPai(pai) {
		return !this.isKanzi && this.pai === pai
	}
}

module.exports = ThreeInfo

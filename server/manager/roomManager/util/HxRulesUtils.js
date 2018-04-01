const ALL_RULES = require('./mj_rules')
const HXDZ_RULES = ALL_RULES.find(r=>r.key === 'hxdz')

function _getRuleItemOf(key) {
	return HXDZ_RULES.rules.find(r => r.key === key)
}

module.exports.getCardOfRule = function(selectArray) {
	var index = selectArray[0][0]
	return _getRuleItemOf('fjsz').options[index].value
}

module.exports.getRoomConfig = function(selectArray) {
	const confs = HXDZ_RULES.rules.map((r, index)=>{
		let selectedIndex = selectArray[index]
		return {
			title: r.title,
			contents: selectedIndex.map(idx=>{
				return idx < r.options.length && r.options[idx].title
			})
		}
	})
	return confs
}

module.exports.getRoomRule = function(selectArray) {
	var rule = _generateEmptyRule(selectArray)

	var index1 = selectArray[0][0]
	rule.numOfJu = _getRuleItemOf('fjsz').options[index1].value

	var index2 = selectArray[1][0]
	rule.dfOfJu = _getRuleItemOf('dzdf').options[index2].value

	if (selectArray.length > 2 && selectArray[2].length > 0) {
		selectArray[2].forEach(index => {
			if (index == 0) {
				rule.isNaForDouble = true
			}
			if (index == 1) {
				rule.isNaFor3Gang = true
			}
			if (index == 2) {
				rule.isNaForQYS = true
			}
			if (index == 3) {
				rule.isNaFor31 = true
			}
			if (index == 4) {
				rule.isNaForThreeKanAndTou = true
			}
			if (index == 5) {
				rule.isNaForZFB = true
			}
			if (index == 6) {
				rule.isNaForAnLXT = true
			}
			if (index == 7) {
				rule.isNaFor50Point = true
			}
			if (index == 8) {
				rule.isNaForDTCZM = true
			}
		})
	}

	if (selectArray.length > 3 && selectArray[3].length > 0) {
		selectArray[3].forEach(index => {
			if (index == 0) {
				rule.isFengForThreeKan = true
			}
		})
	}
	return rule
}

function _generateEmptyRule() {
	var rule = {}
	rule.numOfJu = 0
	rule.dfOfJu = 0
	//是不是随风三大砍
	rule.isFengForThreeKan = false
	//逢双拿不拿，除双杠，双连号，但不包括三杠
	rule.isNaForDouble = false
	//三杠拿不拿
	rule.isNaFor3Gang = false
	//清一色拿不拿
	rule.isNaForQYS = false
	//31点加10点拿不拿
	rule.isNaFor31 = false
	//三大砍带头拿不拿
	rule.isNaForThreeKanAndTou = false
	//中发白拿不拿
	rule.isNaForZFB = false
	//暗老小头拿不拿
	rule.isNaForAnLXT = false
	//点炮50点，自摸100点
	rule.isNaFor50Point = false
	//大跳车自摸拿不拿
	rule.isNaForDTCZM = false
	return rule
}

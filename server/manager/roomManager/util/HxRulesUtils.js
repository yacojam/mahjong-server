const roomRule = require('./hxdzRule')

const difengs = [10, 15, 25, 50]
const difengDescs = ['10元一刀', '15元一刀', '25元一刀', '50元一刀']

const cardRules = [1, 2, 4]
const cardRulesDescs = ['一刀一打', '两刀连打', '一局四刀']

const naRulesDescs = [
	'逢双(除双杠双连)',
	'三杠',
	'清一色',
	'31加10',
	'三大砍带头',
	'红三番',
	'暗老小头',
	'点炮50点自摸100点',
	'大跳车自摸'
]

const otherRules = ['随风三大砍']

const rule1 = {
	title: '房间设置',
	isHuchi: true,
	contents: cardRulesDescs,
	defaultIndex: 0
}

const rule2 = {
	title: '刀子底分',
	isHuchi: true,
	contents: difengDescs,
	defaultIndex: 0
}

const rule3 = {
	title: '附加大拿',
	isHuchi: false,
	contents: naRulesDescs,
	defaultIndex: -1
}

const rule4 = {
	title: '额外设置',
	isHuchi: false,
	contents: otherRules,
	defaultIndex: -1
}

var rules = [rule1, rule2, rule3, rule4]
module.exports.rules = rules

module.exports.getCardOfRule = function(selectArray) {
	var index = selectArray[0][0]
	return cardRules[index]
}

module.exports.getRoomConfig = function(selectArray) {
	var confs = []
	var index1 = selectArray[0][0]
	var config1 = {
		title: '房间设置',
		contents: [cardRulesDescs[index1]]
	}
	confs.push(config1)

	var index2 = selectArray[1][0]
	var config2 = {
		title: '刀子底分',
		contents: [difengDescs[index2]]
	}
	confs.push(config2)

	if (selectArray.length > 2 && selectArray[2].length > 0) {
		var contents = []
		selectArray[2].forEach(index => {
			contents.push(naRulesDescs[index])
		})
		contents = contents.filter(s => s != null)
		var config3 = {
			title: '附加大拿',
			contents: contents
		}
		confs.push(config3)
	}

	if (selectArray.length > 3 && selectArray[3].length > 0) {
		var contents = []
		selectArray[3].forEach(index => {
			contents.push(otherRules[index])
		})
		contents = contents.filter(s => s != null)
		var config4 = {
			title: '额外设置',
			contents: contents
		}
		confs.push(config4)
	}
	return confs
}

module.exports.getRoomRule = function(selectArray) {
	console.log('selectArray' + selectArray)
	var rule = roomRule.generateEmptyRule()
	var index1 = selectArray[0][0]
	rule.numOfJu = cardRules[index1]

	var index2 = selectArray[1][0]
	rule.dfOfJu = difengs[index2]

	if (selectArray.length > 2 && selectArray[2].length > 0) {
		console.log(selectArray[2])
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

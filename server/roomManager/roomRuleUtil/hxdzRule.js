function generateEmptyRule() {
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
}

module.exports.generateEmptyRule = generateEmptyRule

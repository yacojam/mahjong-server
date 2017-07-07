const difengs = [10,15,25];
const difengDescs = ['10元一刀','15元一刀','25元一刀'];

const cardRules = [1,2,4];
const cardRulesDescs = ['一刀一打','2刀连打','一局4刀'];

const naRulesDescs = ['逢双(除双杠双连)', '三杠','清一色','31加10','三大砍带头','红三番','暗老小头','点炮50点自摸100点','大跳车自摸'];

const otherRules = ['随风三大砍'];

const rule1 = {
	title:'房间设置',
	isHuchi:true,
	contents:cardRulesDescs,
    defaultIndex:0
};

const rule2 = {
	title:'刀子底分',
	isHuchi:true,
	contents:difengDescs,
    defaultIndex:0
};

const rule3 = {
	title:'附加大拿',
	isHuchi:false,
	contents:naRulesDescs,
    defaultIndex:-1
};

const rule4 = {
	title:'额外设置',
	isHuchi:false,
	contents:otherRules,
    defaultIndex:-1
};

var rules = [rule1,rule2,rule3,rule4];
module.exports.rules = rules;

module.exports.getCardOfRule = function(index){
	return cardRules[index];
};



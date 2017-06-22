//var CommonRules = require('./CommonRules');
//var ThreeInfo = require('./ThreeInfo');
//var CommonUtils = require('./CommonUtils');
var HxRules = require('./HxRules');
//var HxmjUtils = require('./HxmjUtils');


//计算点数
var shouPais = [11,11,27,27]; 
var pengPais = [19,21,29];
var gangPais = [];
var anGangPais = [];
var huPai = 11;

var isTingOnly = false;
var isZimo = false;
var hr = new HxRules(true,true,true,true,true,true,true,true,true);

var hr2 = new HxRules(false,false,false,false,false,false,false,false,false);

var huPaiType = HxRules.getHuType(pengPais, shouPais, huPai);
console.log(huPaiType);

console.log(hr2.getScore(pengPais, gangPais, anGangPais, shouPais, huPai, huPaiType, isTingOnly, false, isZimo,false,false));
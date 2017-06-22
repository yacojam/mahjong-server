var CommonRules = require('./CommonRules');
var CommonUtils = require('./CommonUtils');

var ThreeInfo = require('./ThreeInfo');
var CommonHuPaiInfo = require('./CommonHuPaiInfo');

var HxmjUtils = function(pengPais,gangPais,anGangPais,shouPais,huPai){
    this.pengPais = pengPais;
    this.gangPais = gangPais;
    this.anGangPais = anGangPais;
    this.shouPais = shouPais;
    this.huPai = huPai;
    
    //this.huPaiType = getHuType(pengPais, shouPais, huPai);

    //初始化后进行基本信息分析
    this.allTypeNumArr = getAllTypeNum(pengPais,gangPais,shouPais,huPai);
    this.isQYS = isQYSWithTypeArray(this.allTypeNumArr);
    this.isCYS = isCYSWithTypeArray(this.allTypeNumArr);
    this.isMenqing = isMenq(pengPais,anGangPais);
    this.isYYH = isYYH(pengPais, shouPais, huPai);
    this.shNum = getSiHeNum(pengPais, shouPais, huPai);
    this.tongArray = getTongArr(pengPais, gangPais, shouPais, huPai);
    this.is8tong = has8tong(this.tongArray);

    this.allCommonHuPaiInfos = [];

    //log
    //console.log(this.huPaiType);
    // console.log(this.allTypeNumArr);
    // console.log(this.isQYS);
    // console.log(this.isCYS);
    // console.log(this.isMenqing);
    // console.log(this.isYYH);
    // console.log(this.shNum);
    // console.log(this.tongArray);
    // console.log(this.is8tong);
};

/***
 ** 分析出手牌+胡牌，可以组成的 将对+3张组合
 **/
HxmjUtils.prototype.getAllCommonHuPaiInfos = function() {
    var allCommonHuPaiInfos = [];
    var allPais = this.shouPais.concat();
    allPais.push(this.huPai);
    allPais.sort();
    var plength = allPais.length;
    for (var i = 0; i < plength;) {
        var copyAllPais = allPais.concat();
        if (i < plength - 1 && copyAllPais[i] == copyAllPais[i+1]) {
            //console.log('在' + i + '位置上检测到将对 ： ' + copyAllPais[i]);
            copyAllPais.splice(i,2);
            if (CommonRules.isMatchHuWithoutJiangDui(copyAllPais)) {
                //console.log('去除将对后，满足胡牌');
                var threeInfos = getThreeInfosWithoutJiangDui(copyAllPais);
                //console.log('3张的信息为：');
                // threeInfos.forEach(function(e){
                //     console.log(e.isKanzi + ' ' + e.pai);
                // });
                var commonHuPaiInfo = new CommonHuPaiInfo(allPais[i], threeInfos, this.shouPais,this.pengPais,this.gangPais,this.anGangPais,this.huPai);
                allCommonHuPaiInfos.push(commonHuPaiInfo);
            } else {
                //console.log('去除将对后，但是不可以胡牌');
            }
            //console.log('----------------');
            var j = i + 2;
            while (j < plength ) {
                if (allPais[i] == allPais[j]) {
                    j++;
                } else {
                    break;
                }
            };
            i = j;
        } else {
            i++;
        }
    }
    this.allCommonHuPaiInfos = allCommonHuPaiInfos;
};

function getThreeInfosWithoutJiangDui(shouPaisNoJD){
    var threeInfos = [];
    var copyShouPaisNoJD = shouPaisNoJD.concat();
    analyseThreeInfosWithoutJiangDui(copyShouPaisNoJD,threeInfos);
    return threeInfos;
};
//
function analyseThreeInfosWithoutJiangDui(shouPaisNoJD,threeInfos) {
    if (shouPaisNoJD.length == 0) {
        return;
    }
    if (shouPaisNoJD[0] == shouPaisNoJD[1] && shouPaisNoJD[0] == shouPaisNoJD[2]) {
        var threeInfo = new ThreeInfo(true,shouPaisNoJD[0]);
        //console.log(threeInfo.isKanzi + threeInfo.pai);
        threeInfos.push(threeInfo);
        shouPaisNoJD.splice(0,3);
        analyseThreeInfosWithoutJiangDui(shouPaisNoJD,threeInfos);
    } else {
        if (CommonUtils.contains(shouPaisNoJD, shouPaisNoJD[0] + 1) && CommonUtils.contains(shouPaisNoJD, shouPaisNoJD[0] + 2)) {
            var threeInfo = new ThreeInfo(false,shouPaisNoJD[0])
            //console.log(threeInfo.isKanzi + ' ' + threeInfo.pai);
            threeInfos.push(threeInfo);
            //console.log(this.threeInfos.length);
            CommonUtils.removeItem(shouPaisNoJD, shouPaisNoJD[0] + 1);
            CommonUtils.removeItem(shouPaisNoJD, shouPaisNoJD[0] + 2);
            CommonUtils.removeItem(shouPaisNoJD, shouPaisNoJD[0]);
            analyseThreeInfosWithoutJiangDui(shouPaisNoJD,threeInfos);
        };
    }
};

HxmjUtils.prototype.getNumAnLXT = function(isZimo) {
    var type = 0;
    for (var i = 0 ; i <= this.allCommonHuPaiInfos.length - 1; i++) {
        var temp = this.allCommonHuPaiInfos[i].getAnLXTNum(isZimo);
        if (temp > type) {
            type = temp;
        };
    };
    return type;
};

HxmjUtils.prototype.hasDragon = function() {
    for (var i = 0 ; i <= this.allCommonHuPaiInfos.length - 1; i++) {
        if (allCommonHuPaiInfos[i].hasOneDragon()) {
            return true;
        };
    };
    return false;
};

HxmjUtils.prototype.getSanDKType = function(isFengForThreeKan) {
    var type = 0;
    for (var i = 0 ; i <= this.allCommonHuPaiInfos.length - 1; i++) {
        var temp = this.allCommonHuPaiInfos[i].getSanDKType(isFengForThreeKan);
        if (temp > type) {
            type = temp;
        };
    };
    return type;
};

HxmjUtils.prototype.isPPH = function() {
    for (var i = 0 ; i <= this.allCommonHuPaiInfos.length - 1; i++) {
        if (this.allCommonHuPaiInfos[i].isPPH()) {
            return true;
        };
    };
    return false;
};

HxmjUtils.prototype.is4DK = function(isFengForThreeKan){
    for (var i = 0 ; i <= this.allCommonHuPaiInfos.length - 1; i++) {
        if (this.allCommonHuPaiInfos[i].hasSiDK(isFengForThreeKan)) {
            return true;
        };
    };
    return false;
};

HxmjUtils.prototype.getScore = function(isZimo,isTingOnly,isFengForThreeKan){
    var highScore = 0;
    for (var i = 0; i < this.allCommonHuPaiInfos.length; i++) {
        var score = 0;
        score += this.allCommonHuPaiInfos[i].getPairsScore(isZimo,isTingOnly);
        score += this.allCommonHuPaiInfos[i].getDragonScore();
        score += this.allCommonHuPaiInfos[i].getLhScore();
        score += this.allCommonHuPaiInfos[i].getBBScore();
        score += this.allCommonHuPaiInfos[i].getLXTScore();
        score += this.allCommonHuPaiInfos[i].getSDKScore(isFengForThreeKan);
        score += this.allCommonHuPaiInfos[i].getPPHScore();
        if (score > highScore) {
            highScore = score;
        };
    };
    return highScore;
};

/***检测是不是门清****/
function isMenq (pengPais,anGangPais){
    return pengPais.length == 0 || (pengPais.length == anGangPais.length);
};
/***判断牌组是不是幺幺胡****/
function isYYH(pengPais,shouPais,huPai){
    var pais = pengPais.concat(shouPais);
    pais.push(huPai);
    var isAll = true;
    for (var i = 0; i < pais.length; i++) {
        type = CommonRules.getPaiType(pais[i]);
        if (type == 5 || type == 4 || pais[i] == 11 || pais[i] == 19|| pais[i] == 21|| pais[i] == 29|| pais[i] == 31|| pais[i] == 39) {
            continue;
        } else {
            isAll = false;
            break;
        }
    };
    return isAll;
};

/**
 ** 分析出四核的数量
 **/
function getSiHeNum(pengPais,shouPais,huPai){
    var num = 0;
    copyAllPais = shouPais.concat();
    copyAllPais.push(huPai);
    pengPais.forEach(function(e){
        if(CommonUtils.contains(copyAllPais,e)){
            num++;
        }
    });
    if (copyAllPais.length < 8) {
        return num;
    };
    copyAllPais.sort();
    //console.log(copyAllPais);
    for (var i = 0; i < copyAllPais.length - 3;) {
        //console.log('... ' + i);
        var j = i + 1;
        while(j<copyAllPais.length){
            //console.log('...... ' + j);
            if (copyAllPais[j] != copyAllPais[i]) {
                break;
            } 
            j++;
        }
        if (j - i == 4) {
            //console.log('hasSihe ' + j);
            num++;
        };
        i = j;
    };
    return num;
}

/**
 ** 分析出现通的情况的数组
 **/
function getTongArr(pengPais,gangPais,shouPais,huPai){
    var copyShouPais = shouPais.concat();
    copyShouPais.push(huPai);
    pengPais.forEach(function(e){
        copyShouPais.push(e);
        copyShouPais.push(e);
        copyShouPais.push(e);
    });
    gangPais.forEach(function(e){
        copyShouPais.push(e);
    });
    var typeNumArr = [0,0,0,0,0,0,0,0,0];
    var paisWithNoFeng = copyShouPais.filter(function(e){
        return e < 40;
    });
    paisWithNoFeng.forEach(function(e){
        type = e % 10;
        typeNumArr[type - 1]++;
    });
    var fiteA = typeNumArr.filter(function(e){
        return e > 4;
    });
    return fiteA;
};

function has8tong(fiteA){
    var filterArr = fiteA.filter(function(e){return e==8});
    return filterArr.length != 0;
};

/**
 ** 获取所有类型牌的数量
 ** 可以根据这个结果，快速的分析出清一色和草一色
 **/
//获取所有类型牌的数量，[a,b,c,d,e,f]里面的元素代表万，筒，条，中发白，东南西北；最后一个无用
function getAllTypeNum (pengPais,gangPais,shouPais,huPai){
	var copyShouPais = shouPais.concat();
    copyShouPais.push(huPai);
	pengPais.forEach(function(e){
        copyShouPais.push(e);
        copyShouPais.push(e);
        copyShouPais.push(e);
	});
	gangPais.forEach(function(e){
        copyShouPais.push(e);
	});
	var typeNumArr = [0,0,0,0,0,0];
	copyShouPais.forEach(function(e){
        type = CommonRules.getPaiType(e);
        typeNumArr[type - 1]++;
	});
	return typeNumArr;
}

//分析是不是草一色
function isCYSWithTypeArray(arr)
{
    var arr1 = arr.filter(function(e,i,a){
        return e>0 && i<3;
    });
    var arr2 = arr.filter(function(e,i,a){
        return e>0 && i>2;
    });
    if (arr1.length == 1 && arr2.length > 0) {
        return true;
    };
    return false;
}

//分析是不是清一色
function isQYSWithTypeArray(arr)
{
    var arr1 = arr.filter(function(e,i,a){
        return e>0 && i<3;
    });
    var arr2 = arr.filter(function(e,i,a){
        return e>0 && i>2;
    });
    if (arr1.length == 1 && arr2.length == 0) {
        return true;
    };
    return false;
}

module.exports = HxmjUtils;


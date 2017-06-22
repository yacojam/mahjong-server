var CommonRules = require('./CommonRules');
var ThreeInfo = require('./ThreeInfo');
var CommonUtils = require('./CommonUtils');
var CommonHuPaiInfo = require('./CommonHuPaiInfo');
var HxmjUtils = require('./HxmjUtils');

var HxRules = function(isFengForThreeKan,isNaForDouble,isNaFor3Gang,isNaForQYS,isNaFor31,isNaForThreeKanAndTou,isNaForZFB,isNaForAnLXT,isNaFor50Point){
    //是不是随风三大砍
    this.isFengForThreeKan = isFengForThreeKan;

    //逢双拿不拿，除双杠，双连号，但不包括三杠
    this.isNaForDouble = isNaForDouble;
    //三杠拿不拿
    this.isNaFor3Gang = isNaFor3Gang;
    //清一色拿不拿
    this.isNaForQYS = isNaForQYS;
    //31点加10点拿不拿
    this.isNaFor31 = isNaFor31;
    
    //三大砍带头拿不拿
    this.isNaForThreeKanAndTou = isNaForThreeKanAndTou;

    //中发白拿不拿
    this.isNaForZFB = isNaForZFB;
    
    //暗老小头拿不拿
    this.isNAForAnLXT = isNaForAnLXT;
    
    //点炮50点，自摸100点
    this.isNaFor50Point = isNaFor50Point;
    // //杠后开花的type，0不加点子不加自摸，1加点子不加自摸，2不加点子加自摸，3加点子加自摸
    // this.gangType = gangType;
    
};

/**
 ** 和县麻将的胡牌检测
 **/
HxRules.getHuType = function(pengPais,shouPais,huPai){
    //非正常胡牌1，乱分
    var allPais = pengPais.concat(shouPais);
    allPais.push(huPai);
    var isLuanfeng = CommonRules.isAllPaisTypeFeng(allPais);
    if (isLuanfeng) {
        return 1;
    };

    //非正常胡牌2，七对
    var isSP = CommonRules.isSevenPairs(shouPais, huPai);
    if (isSP) {
        return 2;
    };

    //判断能否正常胡牌
    return CommonRules.canHu(shouPais,huPai) ? 3 : 0;
};

/**
 ** ******** 自定义大拿的牌型检测 *********
 ** 实例方法
 ** 根据胡牌type，目的性的检测
 ** 如果返回9999，就是默认大拿
 **/
HxRules.prototype.getScore = function(pengPais,gangPais,anGangPais,shouPais,huPai,huPaiType,isTingOnly,isLastOne,isZimo,isGangHua,isQiangGang){

    /** ---- 判断基本大拿的牌型 ----**/
    //乱分拿
    if (huPaiType == 1) {
        console.log('乱分拿');
        return 9999;
    };
    var hxmjInfo = new HxmjUtils(pengPais, gangPais, anGangPais, shouPais, huPai);
    //双四核拿
    if(hxmjInfo.shNum >= 2){
        console.log('双四核拿');
        return 9999;
    };
    //门清清一色拿
    if (hxmjInfo.isMenqing && hxmjInfo.isQYS) {
        console.log('门清清一色拿');
        return 9999;
    };

    //8通拿
    if (hxmjInfo.is8tong) {
        console.log('8通拿');
        return 9999;
    };

    //幺幺胡
    if (hxmjInfo.isYYH) {
        console.log('幺幺胡拿');
        return 9999;
    };
    
    var bbNumFor7P = 0;
    //7对双棒棒
    if (huPaiType == 2) {
        bbNumFor7P = getBBNumForSevenPairs(shouPais, huPai, this.isFengForThreeKan);
        if (bbNumFor7P == 2) {
            console.log('7对双棒棒拿');
            return 9999;
        };
    }
    //门清碰碰胡
    if (huPaiType == 3) {
        hxmjInfo.getAllCommonHuPaiInfos();
        if (hxmjInfo.isMenqing && hxmjInfo.isPPH()) {
            console.log('门清碰碰胡拿');
            return 9999;
        };
    };

    /** ---- 判断极小概率大拿的牌型（4杠／3通／4大砍 / 清一色大跳车） ----**/
    if (gangPais.length == 4) {  //4杠拿
        console.log('4杠拿');
        return 9999;
    };
    
    if (hxmjInfo.tongArray.length > 2) { //3通拿
        console.log('3通拿');
        return 9999;
    };
    if (huPaiType == 3) { //4大砍
        if (hxmjInfo.is4DK(this.isFengForThreeKan)) {
            console.log('4大砍');
            return 9999;
        };
    };
    if (hxmjInfo.isQYS && pengPais.length == 4) { //清一色大跳车
        console.log('清一色大跳车拿');
        return 9999;
    };

    /** ---- 判断自定义规则大拿的牌型 ----**/
     
    //逢双就拿的情况，顺便把通的点数算一下
    var tongScore = getTongScore(hxmjInfo.tongArray,this.isNaForDouble);
    if (tongScore == 9999) {
        console.log('双通拿');
        return 9999;
    };
    
    //双8支情况，顺便把支子的点数算一下
    var typeScore = getTypeScore(hxmjInfo.allTypeNumArr, this.isNaForDouble);
    if (typeScore == 9999) {
        console.log('双8支拿');
        return 9999;
    };

    //三杠拿不拿，顺便把杠的点数计算一下
    var gangScore = getGangScore(gangPais, this.isNaFor3Gang);
    if (gangScore == 9999) {
        console.log('三杠拿');
        return 9999;
    };

    //清一色拿不拿
    if (hxmjInfo.isQYS) {
        if (this.isNaForQYS) {
            console.log('清一色拿');
            return 9999;
        }
    };

    if (huPaiType == 3) {
        var sdkType = hxmjInfo.getSanDKType(this.isFengForThreeKan);
        //console.log('sdkType ：' + sdkType);
    };

    //31点加10点
    if (this.isNaFor31) {
        if (hxmjInfo.isQYS) {
            //四核
            if (hxmjInfo.shNum > 0) {
                console.log('清一色+四核拿');
                return 9999;
            };
            //枯枝呀
            if (isLastOne) {
                console.log('清一色+枯枝呀拿');
                return 9999;
            };
            //碰碰胡
            if(hxmjInfo.isPPH()) {
                console.log('清一色+鹏鹏胡拿');
                return 9999;
            };
            // 不需要判断清一色+一条龙，要么是门清，要么有四核
            // if(hasDragon(allCommonHuPaiInfos)){
            //     return 9999;
            // }

            if (sdkType>= 3) {
                console.log('清一色+三大砍拿');
                return 9999;
            };
        };
        //七对的情况
        if (huPaiType == 2) {
            if (hxmjInfo.shNum > 0) {
                console.log('七对+四核拿');
                return 9999;
            };
            if (hxmjInfo.isCYS) {
                console.log('七对+草一色拿');
                return 9999;
            };
        };

        //大跳车
        if (pengPais.length == 4) {
            if (hxmjInfo.isCYS) {
                console.log('大跳车+草一色拿');
                return 9999;
            };
            if (sdkType >= 3) {
                console.log('大跳车+三大砍拿');
                return 9999;
            };
        };
    };

    //三大砍带头
    if (this.isNaForThreeKanAndTou) {
        if (sdkType == 3.5 || sdkType == 50.5) {
            console.log('三大砍+头拿');
            return 9999;
        };
    };

    //中发白
    if (this.isNaForZFB && sdkType >= 50) {
        console.log('中发白拿');
        return 9999;
    };

    //暗老小头
    if (this.isNAForAnLXT) {
        var anLXTNum = hxmjInfo.getNumAnLXT(isZimo);
        if (anLXTNum > 0) {
            console.log('安老小头拿');
            return 9999;
        };
    };

    /** -------分析要计算的点数------- **/
    //七对特殊的情况
    if (huPaiType == 2) { 
        //计算点数
        var score = 31;
        score = score + typeScore + tongScore;
        if (hxmjInfo.shNum > 0) {
            score += 10;
        };
        if (hxmjInfo.isCYS) {
            score += 10;
        };
        if (bbNumFor7P > 0) {
            score += 5;
        };
        if (this.isNaFor50Point && score >= 50) {
            console.log('50点拿');
            return 9999;
        };
        if (isZimo) {
            return score * 2;
        };
        return score;
    };

    if (pengPais.length == 4) {
        var score = 31;
        score = score + typeScore + tongScore + gangScore;
        if (hxmjInfo.isCYS) {
            score += 10;
        };
        if (sdkType > 3) {
            score += 10;
        };
        //判断碰的牌中的老小头积分
        score += getLXTScoreWithPengPais(pengPais);
        score += isGangHua ? 5 : 0;
        if (this.isNaFor50Point && score >= 50) {
            console.log('50点拿');
            return 9999;
        };
        if (isZimo) {
            return score * 2;
        };
        return score;
    };

    //清一色不算支子点书
    if (hxmjInfo.isQYS) {
        var score = 31;
        if (hxmjInfo.shNum > 0) {
            score += 10;
        };
        score += hxmjInfo.getScore(isZimo, isTingOnly, this.isFengForThreeKan);
        if (isQiangGang) {
            score += 5;
        };
        if (isLastOne) {
            score += 20;
        };
        if (isGangHua) {
            score += 5;
        };
        if (this.isNaFor50Point && score >= 50) {
            console.log('50点拿');
            return 9999;
        };
        if (isZimo) {
            return score * 2;
        };
        return score;
    };

    var score = 4;
    score = score + typeScore + tongScore + gangScore;
    if (hxmjInfo.shNum > 0) {
        score += 10;
    };
    if (hxmjInfo.isCYS > 0) {
        score += 10;
    };
    if (hxmjInfo.isMenqing) {
        score+=5;
    };
    score += hxmjInfo.getScore(isZimo, isTingOnly, this.isFengForThreeKan);
    if (isQiangGang) {
        score += 5;
    };
    if (isLastOne) {
        score += 20;
    };
    if (isGangHua) {
        score += 5;
    };
    if (this.isNaFor50Point && score >= 50) {
        console.log('50点拿');
        return 9999;
    };
    if (isZimo) {
        return score * 2;
    };
    return score;

};

function getLXTScoreWithPengPais(pengPais){
    var num = 0;
    if (CommonUtils.contains(pengPais,11) && CommonUtils.contains(pengPais,19)) {
        num++;
    };
    if (CommonUtils.contains(pengPais,21) && CommonUtils.contains(pengPais,29)) {
        num++;
    };
    if (CommonUtils.contains(pengPais,31) && CommonUtils.contains(pengPais,39)) {
        num++;
    };
    return num == 0 ? 0 : (num == 1 ? 5 : 15);
};

//分析有几个棒棒
function getBBNumForSevenPairs(shouPais,huPai,isFengForThreeKan){
    var num = 0;
    var copyShouPais = shouPais.concat();
    copyShouPais.push(huPai);
    copyShouPais.sort();
    
    var singlePairs = [];
    singlePairs.push(copyShouPais[0]);
    singlePairs.push(copyShouPais[2]);
    singlePairs.push(copyShouPais[4]);
    singlePairs.push(copyShouPais[6]);
    singlePairs.push(copyShouPais[8]);
    singlePairs.push(copyShouPais[10]);
    singlePairs.push(copyShouPais[12]);
    
    var copy = [];
    for (var i = 0; i < singlePairs.length - 2; i++) {
        if (!CommonUtils.contains(copy, i)) {
            //console.log('i' + i);
            var finded = false;
            for (var j = i+1; j < singlePairs.length - 1 && !finded; j++) {
                //console.log('j' + j);
                if ((singlePairs[j] == singlePairs[i] + 1) && !CommonUtils.contains(copy, j)) {
                    for (var k = j+1; k < singlePairs.length && !finded; k++) {
                        if ((singlePairs[k] == singlePairs[j] + 1) && !CommonUtils.contains(copy, k)){
                            finded = true;
                            copy.push(i);
                            copy.push(j);
                            copy.push(k);
                        }
                    }
                };
            };
        };
    };
    num += copy.length / 3;
    
    var dnxb = [0,0,0,0];
    var sumDNXB = 0;
    var zfb = [0,0,0];
    var sumZFB = 0;
    for (var i = singlePairs.length - 1; i >= 0; i--) {
        if(singlePairs[i] == 51){
            zfb[0]++;
            sumZFB++;
        }
        if(singlePairs[i] == 53){
            zfb[1]++;
            sumZFB++;
        }
        if(singlePairs[i] == 55){
            zfb[2]++;
            sumZFB++;
        }
        if(singlePairs[i] == 41){
            dnxb[0]++;
            sumDNXB++;
        }
        if(singlePairs[i] == 43){
            dnxb[1]++;
            sumDNXB++;
        }
        if(singlePairs[i] == 45){
            dnxb[2]++;
            sumDNXB++;
        }
        if(singlePairs[i] == 47){
            dnxb[3]++;
            sumDNXB++;
        }
    };
    var filterDNXB = dnxb.filter(function(e){
        return e>0;
    });
    var filterZFB = zfb.filter(function(e){
        return e>0;
    });
    //console.log(sumDNXB + ' ' + sumZFB);
    if (isFengForThreeKan) {
        if (filterDNXB.length + filterZFB.length > 2) {

            num += (sumDNXB + sumZFB) / 3;
        };

    }else {
        if (filterDNXB.length > 2) {
            num+= sumDNXB / 3;
        };
        if (filterZFB.length == 3) {
            num+= sumZFB / 3;
        };
    }
    return parseInt(num);
}

//获取通的点数
function getTongScore(tongArr,isNaForDouble){
    if (tongArr.length > 1 && isNaForDouble) {
        return 9999;
    };
    var tongScore = 0;
    if (tongArr.length == 1) {
        tongScore = tongArr[0];
    };
    if (tongArr.length == 2) {
        tongScore = tongArr[0] + tongArr[1] + 5;
    };
    return tongScore;
};

//获取支子点数
function getTypeScore(arr,isNaForDouble){
    var filterArr = arr.filter(function(e,i,arr){
        return i<3;
    });
    filterArr.push(arr[3]+arr[4]);
    var filterArr2 = filterArr.filter(function(e,i,arr){
        return e > 7;
    });
    if (filterArr2.length == 0) {
        return 0;
    } else {
        if (filterArr2.length == 1) {
            return filterArr2[0] - 7;
        } else {
            return  isNaForDouble ? 9999 : (filterArr2[0] - 7 + filterArr2[1] - 7 + 5);
        }
    }
};

//获取杠的点数
function getGangScore(gangPais,isNaFor3Gang){
    if (gangPais.length == 3) {
        return isNaFor3Gang ? 9999 : 10;
    };
    if (gangPais.length == 2) {
        return 5;
    };
    return 0;
}


module.exports = HxRules;


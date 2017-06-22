var ThreeInfo = require('./ThreeInfo');
var CommonUtils = require('./CommonUtils');

var CommonHuPaiInfo = function(jiangdui,threeInfos,shouPais,pengPais,gangPais,anGangPais,huPai){
	this.jiangdui = jiangdui;
	this.threeInfos = threeInfos;
	this.kanziThreeInfos = threeInfos.filter(function(e){
		return e.isKanzi;
	});
	this.tangziThreeInfos = threeInfos.filter(function(e){
		return !e.isKanzi;
	});
	this.shouPais = shouPais;
	this.pengPais = pengPais;
    this.gangPais = gangPais;
    this.anGangPais = anGangPais;
    this.huPai = huPai;
};

//获取对子点数
CommonHuPaiInfo.prototype.getPairsScore = function(isZimo,isTingOnly){
    var sumNum= this.pengPais.length + this.gangPais.length;
    //纯Y算一对
    if (isTingOnly && this.huPai != this.jiangdui) {
        sumNum += 1;
        sumNum += this.kanziThreeInfos.length * 2; 
        return sumNum;
    };
    if (this.kanziThreeInfos.length == 0) {
    	return sumNum;
    };
    var huPai = this.huPai;
    var hasHuPaiKanzi = this.kanziThreeInfos.filter(function(e){
        return e.pai == huPai;
    }).length == 1;
    var isHuPaiInTangzi = this.tangziThreeInfos.filter(function(e){
    	var delta = huPai - e.pai;
        return delta <=2 && delta >=0;
    }).length == 1;
    if (isZimo) {
    	// 坎子数 * 2；
        sumNum += this.kanziThreeInfos.length * 2; 
    } else {
        if ((!hasHuPaiKanzi) || (hasHuPaiKanzi && isHuPaiInTangzi)) {
        	sumNum += this.kanziThreeInfos.length * 2;
        } else {
        	sumNum += this.kanziThreeInfos.length * 2 - 1; 
        }
    }
    return sumNum;
};

//获取一条龙点数
CommonHuPaiInfo.prototype.getDragonScore = function(){
	return this.hasOneDragon() ? 20 : 0;
};
//获取小连号点数
CommonHuPaiInfo.prototype.getLhScore = function(){
	if (this.tangziThreeInfos.length <= 1) {
		return 0;
	};
	if (this.tangziThreeInfos.length == 2) {
		return this.tangziThreeInfos[1].pai == (this.tangziThreeInfos[0].pai + 3) ? 5 : 0;
	};
	var copy = [];
    for (var i = 0; i < this.tangziThreeInfos.length - 1; i++) {
    	if (!CommonUtils.contains(copy, i)) {
    		var finded = false;
    		for (var j = i+1; j < this.tangziThreeInfos.length && !finded; j++) {
    		    if ((this.tangziThreeInfos[j].pai == this.tangziThreeInfos[i].pai + 3) && !CommonUtils.contains(copy, j)) {
                    copy.push(i);
                    copy.push(j);
                    finded = true;;
    		    };
    	    };
    	};
    };
    if (this.hasOneDragon() && copy.length == 2) {
    	return 0;
    };
    var num = copy.length / 2;
	return num == 0 ? 0 : (num == 1 ? 5 : 15);
};
//获取棒棒点数
CommonHuPaiInfo.prototype.getBBScore = function(){
	if (this.tangziThreeInfos.length <= 1) {
		return 0;
	};
	if (this.tangziThreeInfos.length == 2) {
		return this.tangziThreeInfos[1].pai == this.tangziThreeInfos[0].pai ? 5 : 0;
	};
    for (var i = 0; i < this.tangziThreeInfos.length;i++) {
    	for (var j = i+1; j < this.tangziThreeInfos.length; j++) {
    		if (this.tangziThreeInfos[j].pai == this.tangziThreeInfos[i].pai) {
                //console.log('aaaaaa');
                return 5;
    	    };
    	};
    };
	return 0;
};

//获取老小头点数
CommonHuPaiInfo.prototype.getLXTScore = function(){
	var copyPengs = this.pengPais.concat();
	this.kanziThreeInfos.forEach(function(e){
		copyPengs.push(e.pai);
	});
	var num = 0;
	if (CommonUtils.contains(copyPengs,11) && CommonUtils.contains(copyPengs,19)) {
		num++;
	};
	if (CommonUtils.contains(copyPengs,21) && CommonUtils.contains(copyPengs,29)) {
		num++;
	};
	if (CommonUtils.contains(copyPengs,31) && CommonUtils.contains(copyPengs,39)) {
		num++;
	};
	return num == 0 ? 0 : (num == 1 ? 5 : 15);
};

//获取三大砍点书
CommonHuPaiInfo.prototype.getSDKScore = function(isFengForThreeKan){
    var sdkType = this.getSanDKType(isFengForThreeKan);
    return sdkType >= 50 ? 20 : (sdkType >= 3 ? 10 : 0);
};
//获取pengpenghu点书
CommonHuPaiInfo.prototype.getPPHScore = function(){
    return this.isPPH() ? 10 : 0;
};

/****/
CommonHuPaiInfo.prototype.getAnLXTNum = function(isZimo) {
	
	var copyPais = this.anGangPais.concat();
	this.kanziThreeInfos.forEach(function(e){
		copyPais.push(e.pai);
	});
	var num = 0;
	if (CommonUtils.contains(copyPais,11) && CommonUtils.contains(copyPais,19)) {
		if (isZimo) {
			num++;
		} else {
			if (this.huPai == 11 || this.huPai == 19){
			    var huPais = this.shouPais.filter(function(e){
			    	return e == this.huPai;
			    });
			    if(huPais.length == 3){
			    	num++
			    }
		    } else {
		    	num++;
		    }
		}
	};
	if (CommonUtils.contains(copyPais,21) && CommonUtils.contains(copyPais,29)) {
		if (isZimo) {
			num++;
		} else {
			if (this.huPai == 21 || this.huPai == 29){
			    var huPais = this.shouPais.filter(function(e){
			    	return e == this.huPai;
			    });
			    if(huPais.length == 3){
			    	num++
			    }
		    } else {
		    	num++;
		    }
		}
	};
	if (CommonUtils.contains(copyPais,31) && CommonUtils.contains(copyPais,39)) {
		if (isZimo) {
			num++;
		} else {
			if (this.huPai == 31 || this.huPai == 39){
			    var huPais = this.shouPais.filter(function(e){
			    	return e == this.huPai;
			    });
			    if(huPais.length == 3){
			    	num++
			    }
		    } else {
		    	num++;
		    }
		}
	};
	
	return num;
};

//
CommonHuPaiInfo.prototype.isPPH = function() {
	return this.tangziThreeInfos.length == 0;
};

//分析有没有1条龙 型如：1 - 9 （万，筒，条）
CommonHuPaiInfo.prototype.hasOneDragon = function(){
    if (this.tangziThreeInfos.length < 3) {
    	return false;
    };
    return hasOneDragonWithType(this.tangziThreeInfos,1) || hasOneDragonWithType(this.tangziThreeInfos,2) || hasOneDragonWithType(this.tangziThreeInfos,3);
};

function hasOneDragonWithType(threeInfos,type){
	if (type == 1) {
		return CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 11;
		}) && CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 14;
		}) && CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 17;
		});
	};
	if (type == 2) {
		return CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 21;
		}) && CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 24;
		}) && CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 27;
		});
	};
	if (type == 3) {
		return CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 31;
		}) && CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 34;
		}) && CommonUtils.containsObject(threeInfos,function(e){
			return e.pai == 37;
		});
	};
	return false;
}

//0代表没有三大砍；3代表只有三大砍；3.5代表三大砍带一个头；50代表中发白；50.5代表中发白带一个分头
CommonHuPaiInfo.prototype.getSanDKType = function(isFengForThreeKan) {
	var pais = this.pengPais.concat();
	this.kanziThreeInfos.forEach(function(e){
		pais.push(e.pai);
	});
	if (pais.length < 3) {
		return 0;
	};
	pais.sort();

	if (pais.length == 3) {
        return this.getSubSDKType(pais,isFengForThreeKan);
	};
	var type1 = this.getSubSDKType(pais.slice(0,3),isFengForThreeKan);
	var type2 = this.getSubSDKType(pais.slice(1),isFengForThreeKan);
	return type2 > type1 ? type2 : type1;
};

CommonHuPaiInfo.prototype.getSubSDKType = function(pais,isFengForThreeKan){
	//console.log('pais' + pais);
    if (pais[0] < 40) {
            if((pais[1] == pais[0] + 1) && (pais[2] == pais[0] + 2)){
                if (this.jiangdui == pais[0] - 1 || this.jiangdui == pais[2] + 1  ) {
                	return 3.5;
                };
                return 3;
            }
            return 0;
        };
        if (pais[0] == 51) {
        	if (this.jiangdui > 40 && isFengForThreeKan) {
        		return 50.5;
        	};
        	return 50;
        };
        if (isFengForThreeKan) {
        	if (this.jiangdui > 40) {
        		return 3.5;
        	};
        	return 3;
        };
        if (pais[2]<50) {
        	if (this.jiangdui > 40 && this.jiangdui < 50) {
        		return 3.5;
        	};
        	return 3;
        };
        return 0;
};

CommonHuPaiInfo.prototype.hasSiDK = function(isFengForThreeKan) {
	var pais = this.pengPais.concat();
	this.kanziThreeInfos.forEach(function(e){
		pais.push(e.pai);
	});
	if (pais.length < 4) {
		return false;
	};
	pais.sort();

    if (pais[0] < 40) {
        return (pais[1] == pais[0] + 1) && (pais[2] == pais[0] + 2) && (pais[3] == pais[0] + 3);
    };
    if (isFengForThreeKan) {
    	return true;
    };
    return pais[3] == 47;
};

module.exports = CommonHuPaiInfo;
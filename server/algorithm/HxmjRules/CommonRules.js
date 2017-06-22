var CommonUtils = require('./CommonUtils');
var ThreeInfo = require('./ThreeInfo');
var mj_wan = 1; // 11 - 19 代表 1 - 9 万
var mj_tong = 2; // 21 - 29  1 - 9 筒
var mj_tiao = 3; // 31 - 39 1 - 9 条
var mj_dnxb = 4;  // 41 43 45 47 东南西北
var mj_zfb = 5; // 51 53 55 中发白

var CommonRules = function(){}

CommonRules.getPaiType = function(mj) {
	if (mj>= 11 && mj <= 19) {
		return mj_wan;
	};
	if (mj>= 21 && mj <= 29) {
		return mj_tong;
	};
	if (mj>= 31 && mj <= 39) {
		return mj_tiao;
	};
	if (mj== 41 || mj == 43 || mj == 45 || mj == 47) {
		return mj_dnxb;
	};
    if (mj== 51 || mj == 53 || mj == 55) {
        return mj_zfb;
    };
    return 6;
};

//判断牌组是不是都是 风 ／ 中发白
CommonRules.isAllPaisTypeFeng = function(pais){
	var isAll = true;
	for (var i = 0; i < pais.length; i++) {
		type = CommonRules.getPaiType(pais[i]);
		if (type == mj_zfb || type == mj_dnxb) {
			continue;
		} else {
			isAll = false;
			break;
		}
	};
	return isAll;
};



//检测是不是七对
CommonRules.isSevenPairs = function(shouPais,huPai){
	var copyShouPais = shouPais.concat();
	copyShouPais.push(huPai);
	copyShouPais.sort();
	if (copyShouPais.length == 14) {
		var rt = true;
        for (var i = 0; i < 7; i++) {
       	   if (copyShouPais[i * 2] == copyShouPais[i*2+1]) {
       	   	   continue;
       	   } else {
       	   	rt = false;
       	   	break;
       	   }
        };
        return rt;
	};
	return false;
};
 /**
  ** --- 杠牌检测 ---
  ** canGangWithOtherPai 记录别人打的牌能不能杠
  ** canGangWithSelfPai 记录自己摸的时候可不可以杠
  **/   

// CommonRules.canGangWithOtherPai = function(shouPais,newPai) {
//     var samePais = shouPais.filter(function(e,index,array){
//         return e == newPai;
//     }); 
//     if (samePais.length == 3) {
//       	return true;
//     };
//     return false;
// };
// CommonRules.canGangWithSelfPai = function(pengPais,shouPais,newPai) {
// 	if (canGangWithOtherPai(shouPais,newPai)) {
// 		return true;
// 	}
// 	if (commonUtils.contains(pengPais,newPai)) {
// 		return true;
// 	}
// 	for (var i = 0; i<shouPais.length;i++)
// 	{
// 		if (commonUtils.contains(pengPais,shouPais[i])) {
// 			return true;
// 		}
// 	}
//     return false;
// };


/**
 ** --- 传统胡牌的检测算法 ---
 **/
CommonRules.canHu = function(shouPais,huPai){
	if (shouPais.length == 1) {
		return shouPais[0] == huPai;
	};
    copyShouPais = shouPais.concat();
	copyShouPais.push(huPai);
	copyShouPais.sort();
	return CommonRules.isMatchHu(copyShouPais);
};
    
CommonRules.isMatchHu = function(shouPai){
    	var plength = shouPai.length;
		for (var i = 0; i < plength;) {
			//console.log(i);
			var m_shouPai = shouPai.concat();
			if (i < plength - 1 && shouPai[i] == shouPai[i+1]) {
				//console.log('检测到将对' + i);
				//console.log(i);
                m_shouPai.splice(i,2);
                if (CommonRules.isMatchHuWithoutJiangDui(m_shouPai)) {
                	//console.log('检测到将对' + i + '可以胡牌');
                	return true;
                };
                //console.log('检测到将对' + i + '不可以胡牌');
                var j = i + 2;
                while (j < plength ) {
                	if (shouPai[i] == shouPai[j]) {
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
	return false;
};
CommonRules.isMatchHuWithoutJiangDui = function(copyShouPais){
	var shouPais = copyShouPais.concat();
	if (shouPais.length == 0) {
		return true;
	}
	if (shouPais[0] == shouPais[1] && shouPais[0] == shouPais[2]) {
        shouPais.splice(0,3);
        return CommonRules.isMatchHuWithoutJiangDui(shouPais);
	} else {
		if (CommonUtils.contains(shouPais, shouPais[0] + 1) && CommonUtils.contains(shouPais, shouPais[0] + 2)) {
			CommonUtils.removeItem(shouPais, shouPais[0] + 1);
			CommonUtils.removeItem(shouPais, shouPais[0] + 2);
			CommonUtils.removeItem(shouPais, shouPais[0]);
			return CommonRules.isMatchHuWithoutJiangDui(shouPais);
		};
		return false;
	}
};

module.exports = CommonRules;


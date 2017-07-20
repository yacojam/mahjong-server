var CommonUtils = require('./CommonUtils')
var ThreeInfo = require('./ThreeInfo')
var mj_wan = 1 // 11 - 19 代表 1 - 9 万
var mj_tong = 2 // 21 - 29  1 - 9 筒
var mj_tiao = 3 // 31 - 39 1 - 9 条
var mj_dnxb = 4 // 41 43 45 47 东南西北
var mj_zfb = 5 // 51 53 55 中发白

const paiTypes = [
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  41,
  43,
  45,
  47,
  51,
  53,
  55
]

var CommonRules = function() {}

CommonRules.getPaiType = function(mj) {
  if (mj >= 11 && mj <= 19) {
    return mj_wan
  }
  if (mj >= 21 && mj <= 29) {
    return mj_tong
  }
  if (mj >= 31 && mj <= 39) {
    return mj_tiao
  }
  if (mj == 41 || mj == 43 || mj == 45 || mj == 47) {
    return mj_dnxb
  }
  if (mj == 51 || mj == 53 || mj == 55) {
    return mj_zfb
  }
  return 6
}

/**
  ** --- 绝Y检测 ---
  ** 检测是不是枯枝丫
  ** 当只听一张牌的时候，且是最后一张的时候
  **/

CommonRules.isKZY = function(shouPais, pengPais, huPai, isZimo, allChupais) {
  var tingPais = CommonRules.getTingPais(shouPais, pengPais)
  if (tingPais.length == 1) {
    var copyAllChupais = allChupais.concat()
    pengPais.forEach(e => {
      copyAllChupais.push(e)
      copyAllChupais.push(e)
      copyAllChupais.push(e)
    })
    var filterHupais = copyAllChupais.filter(e => {
      return e == huPai
    })
    if (
      (isZimo && filterHupais.length == 3) ||
      (!isZimo && filterHupais.length == 4)
    ) {
      return true
    }
    return false
  }
  return false
}

/**
  ** --- 听牌检测 ---
  ** 获取手牌的听牌
  **/

CommonRules.getTingPais = function(shouPais, pengPais) {
  var tingPais = []
  for (var i = 0; i < paiTypes.length; i++) {
    if (CommonRules.getHuType(pengPais, shouPais, paiTypes[i]) > 0) {
      tingPais.push(paiTypes[i])
    }
  }
  return tingPais
}

/**
  ** --- 碰杠牌检测 ---
  ** 获取目标牌在自己手牌中的数量
  **/

CommonRules.getPaiNum = function(shouPais, pai) {
  var samePais = shouPais.filter(function(e) {
    return e == pai
  })
  return samePais.length
}

/**
  ** --- 弯杠检测 ---
  ** 
  **/
CommonRules.getWanGangPais = function(shouPais, pai, pengPais) {
  var ret = []
  var allPais = shouPais.concat()
  allPais.push(pai)
  allPais.forEach(function(e) {
    if (CommonUtils.contains(pengPais, e)) {
      ret.push(e)
    }
  })
  return ret
}

/**
  ** --- 暗杠检测 ---
  ** 
  **/
CommonRules.getAnGangPais = function(shouPais, pai) {
  var ret = []
  var allPais = shouPais.concat()
  allPais.push(pai)
  allPais.sort()
  if (allPais.length < 4) {
    return ret
  }
  for (var i = 0; i < allPais.length - 3; i++) {
    if (
      allPais[i] == allPais[i + 1] &&
      allPais[i] == allPais[i + 2] &&
      allPais[i] == allPais[i + 3]
    ) {
      ret.push(allPais[i])
    }
  }
  return ret
}

/**
 ** 和县麻将的胡牌检测
 ** 
 ** Add: QueType缺一门的类型
 ** 1：万
 ** 2：筒
 ** 3: 条
 **/
CommonRules.getHuType = function(pengPais, shouPais, huPai, QueType) {
  //非正常胡牌1，乱分
  var allPais = pengPais.concat(shouPais)
  allPais.push(huPai)
  var isLuanfeng = isAllPaisTypeFeng(allPais)
  if (isLuanfeng) {
    return 1
  }

  //加一个缺的判断
  if (!isQueOK(pengPais, shouPais, huPai, QueType)) {
    return 0
  }
  //非正常胡牌2，七对
  var isSP = isSevenPairs(shouPais, huPai)
  if (isSP) {
    return 2
  }

  //判断能否正常胡牌
  return canHu(shouPais, huPai) ? 3 : 0
}

//判断牌组是不是缺一门
function isQueOK(pengPais, shouPais, huPai, QueType) {
  var pais = pengPais.concat(shouPais)
  pais.push(huPai)
  var isAll = true
  for (var i = 0; i < pais.length; i++) {
    type = CommonRules.getPaiType(pais[i])
    if (type != QueType) {
      continue
    } else {
      isAll = false
      break
    }
  }
  return isAll
}

//判断牌组是不是都是 风 ／ 中发白
function isAllPaisTypeFeng(pais) {
  var isAll = true
  for (var i = 0; i < pais.length; i++) {
    type = CommonRules.getPaiType(pais[i])
    if (type == mj_zfb || type == mj_dnxb) {
      continue
    } else {
      isAll = false
      break
    }
  }
  return isAll
}

//检测是不是七对
function isSevenPairs(shouPais, huPai) {
  var copyShouPais = shouPais.concat()
  copyShouPais.push(huPai)
  copyShouPais.sort()
  if (copyShouPais.length == 14) {
    var rt = true
    for (var i = 0; i < 7; i++) {
      if (copyShouPais[i * 2] == copyShouPais[i * 2 + 1]) {
        continue
      } else {
        rt = false
        break
      }
    }
    return rt
  }
  return false
}

/**
 ** --- 传统胡牌的检测算法 ---
 **/
function canHu(shouPais, huPai) {
  if (shouPais.length == 1) {
    return shouPais[0] == huPai
  }
  copyShouPais = shouPais.concat()
  copyShouPais.push(huPai)
  copyShouPais.sort()
  return isMatchHu(copyShouPais)
}

function isMatchHu(shouPai) {
  var plength = shouPai.length
  for (var i = 0; i < plength; ) {
    //console.log(i);
    var m_shouPai = shouPai.concat()
    if (i < plength - 1 && shouPai[i] == shouPai[i + 1]) {
      //console.log('检测到将对' + i);
      //console.log(i);
      m_shouPai.splice(i, 2)
      if (CommonRules.isMatchHuWithoutJiangDui(m_shouPai)) {
        //console.log('检测到将对' + i + '可以胡牌');
        return true
      }
      //console.log('检测到将对' + i + '不可以胡牌');
      var j = i + 2
      while (j < plength) {
        if (shouPai[i] == shouPai[j]) {
          j++
        } else {
          break
        }
      }
      i = j
    } else {
      i++
    }
  }
  return false
}
CommonRules.isMatchHuWithoutJiangDui = function(copyShouPais) {
  var shouPais = copyShouPais.concat()
  if (shouPais.length == 0) {
    return true
  }
  if (shouPais[0] == shouPais[1] && shouPais[0] == shouPais[2]) {
    shouPais.splice(0, 3)
    return CommonRules.isMatchHuWithoutJiangDui(shouPais)
  } else {
    if (
      CommonUtils.contains(shouPais, shouPais[0] + 1) &&
      CommonUtils.contains(shouPais, shouPais[0] + 2)
    ) {
      CommonUtils.removeItem(shouPais, shouPais[0] + 1)
      CommonUtils.removeItem(shouPais, shouPais[0] + 2)
      CommonUtils.removeItem(shouPais, shouPais[0])
      return CommonRules.isMatchHuWithoutJiangDui(shouPais)
    }
    return false
  }
}

module.exports = CommonRules

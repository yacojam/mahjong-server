var CommonRules = require('./CommonRules')
var CommonUtils = require('./CommonUtils')

var ThreeInfo = require('./ThreeInfo')
var HxCommonHuPaiInfo = require('./HxCommonHuPaiInfo')

var HxmjUtils = function(
  pengPais,
  gangPais,
  anGangPais,
  shouPais,
  huPai,
  huPaiType,
  tingPais,
  isKZY,
  isZimo,
  isGSH,
  isQGH,
  roomRules
) {
  this.pengPais = pengPais
  this.gangPais = gangPais
  this.anGangPais = anGangPais
  this.shouPais = shouPais
  this.huPai = huPai
  this.huPaiType = huPaiType
  this.tingPais = tingPais
  this.tingOnly = tingPais.length == 1
  this.isKZY = isKZY
  this.isZimo = isZimo
  this.isGSH = isGSH
  this.isQGH = isQGH
  this.roomRules = roomRules

  //初始化后进行基本信息分析
  this.allTypeNumArr = getAllTypeNum(pengPais, gangPais, shouPais, huPai)
  this.isQYS = isQYSWithTypeArray(this.allTypeNumArr)
  this.isCYS = isCYSWithTypeArray(this.allTypeNumArr)
  this.isMenqing = isMenq(pengPais, anGangPais)
  this.isYYH = isYYH(pengPais, shouPais, huPai)
  this.shNum = getSiHeNum(pengPais, shouPais, huPai)
  this.tongArray = getTongArr(pengPais, gangPais, shouPais, huPai)
  this.is8tong = has8tong(this.tongArray)

  console.log('hupai type', this.huPaiType)
  if (this.huPaiType == 3) {
    this.getAllCommonHuPaiInfos()
  } else {
    this.allCommonHuPaiInfos = []
  }

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
}

//分析有几个棒棒
function getBBNumForSevenPairs(shouPais, huPai, isFengForThreeKan) {
  var num = 0
  var copyShouPais = shouPais.concat()
  copyShouPais.push(huPai)
  copyShouPais.sort()

  var singlePairs = []
  singlePairs.push(copyShouPais[0])
  singlePairs.push(copyShouPais[2])
  singlePairs.push(copyShouPais[4])
  singlePairs.push(copyShouPais[6])
  singlePairs.push(copyShouPais[8])
  singlePairs.push(copyShouPais[10])
  singlePairs.push(copyShouPais[12])

  var copy = []
  for (var i = 0; i < singlePairs.length - 2; i++) {
    if (!CommonUtils.contains(copy, i)) {
      //console.log('i' + i);
      var finded = false
      for (var j = i + 1; j < singlePairs.length - 1 && !finded; j++) {
        //console.log('j' + j);
        if (
          singlePairs[j] == singlePairs[i] + 1 &&
          !CommonUtils.contains(copy, j)
        ) {
          for (var k = j + 1; k < singlePairs.length && !finded; k++) {
            if (
              singlePairs[k] == singlePairs[j] + 1 &&
              !CommonUtils.contains(copy, k)
            ) {
              finded = true
              copy.push(i)
              copy.push(j)
              copy.push(k)
            }
          }
        }
      }
    }
  }
  num += copy.length / 3

  var dnxb = [0, 0, 0, 0]
  var sumDNXB = 0
  var zfb = [0, 0, 0]
  var sumZFB = 0
  for (var i = singlePairs.length - 1; i >= 0; i--) {
    if (singlePairs[i] == 51) {
      zfb[0]++
      sumZFB++
    }
    if (singlePairs[i] == 53) {
      zfb[1]++
      sumZFB++
    }
    if (singlePairs[i] == 55) {
      zfb[2]++
      sumZFB++
    }
    if (singlePairs[i] == 41) {
      dnxb[0]++
      sumDNXB++
    }
    if (singlePairs[i] == 43) {
      dnxb[1]++
      sumDNXB++
    }
    if (singlePairs[i] == 45) {
      dnxb[2]++
      sumDNXB++
    }
    if (singlePairs[i] == 47) {
      dnxb[3]++
      sumDNXB++
    }
  }
  var filterDNXB = dnxb.filter(function(e) {
    return e > 0
  })
  var filterZFB = zfb.filter(function(e) {
    return e > 0
  })
  //console.log(sumDNXB + ' ' + sumZFB);
  if (isFengForThreeKan) {
    if (filterDNXB.length + filterZFB.length > 2) {
      num += (sumDNXB + sumZFB) / 3
    }
  } else {
    if (filterDNXB.length > 2) {
      num += sumDNXB / 3
    }
    if (filterZFB.length == 3) {
      num += sumZFB / 3
    }
  }
  return parseInt(num)
}

//获取自摸的类型 1，平摸，2，Y摸，4，KZY摸
//杠后开花，摸子翻倍，清一色，KZY本上就算一个Y摸
HxmjUtils.prototype.getMotype = function() {
  if (this.huPaiType == 1) {
    if (this.isGSH) {
      return 4
    } else if (this.isZimo) {
      return 2
    } else {
      return 0
    }
  }
  if (this.huPaiType == 2) {
    if (this.isQYS) {
      if (this.isZimo) {
        return 6
      } else {
        return 2
      }
    } else {
      if (this.isZimo) {
        return 2
      } else {
        return 0
      }
    }
  }
  if (this.isZimo) {
    if (this.isKZY) {
      if (this.isQYS) {
        if (this.isGSH) {
          return 18
        } else {
          return 10
        }
      } else {
        if (this.isGSH) {
          return 8
        } else {
          return 4
        }
      }
    } else {
      var canBigMo = this.canBigMo()
      if (this.isQYS) {
        if (this.isGSH) {
          return canBigMo ? 10 : 6
        } else {
          return canBigMo ? 6 : 4
        }
      } else {
        if (this.isGSH) {
          return canBigMo ? 4 : 2
        } else {
          return canBigMo ? 2 : 1
        }
      }
    }
  } else {
    var num = 0
    if (this.isQYS) {
      num += 2
    }
    if (this.isKZY) {
      num += 2
    }
    return num
  }
}

/***
 ** 是时候计算一波积分了
 ** 如果返回9999，就是默认大拿
 **/
HxmjUtils.prototype.calculate = function() {
  /** ---- 判断基本大拿的牌型 ----**/
  //乱分拿
  if (this.huPaiType == 1) {
    console.log('乱分拿')
    return 9999
  }

  //双四核拿
  if (this.shNum >= 2) {
    console.log('双四核拿')
    return 9999
  }
  //门清清一色拿
  if (this.isMenqing && this.isQYS) {
    console.log('门清清一色拿')
    return 9999
  }

  //8通拿
  if (this.is8tong) {
    console.log('8通拿')
    return 9999
  }

  //幺幺胡
  if (this.isYYH) {
    console.log('幺幺胡拿')
    return 9999
  }

  var bbNumFor7P = 0
  //7对双棒棒
  if (this.huPaiType == 2) {
    bbNumFor7P = getBBNumForSevenPairs(
      this.shouPais,
      this.huPai,
      this.roomRules.isFengForThreeKan
    )
    if (bbNumFor7P == 2) {
      console.log('7对双棒棒拿')
      return 9999
    }
  }
  //门清碰碰胡
  if (this.huPaiType == 3) {
    if (this.isMenqing && this.isPPH()) {
      console.log('门清碰碰胡拿')
      return 9999
    }
  }

  /** ---- 判断极小概率大拿的牌型（4杠／3通／4大砍 / 清一色大跳车） ----**/
  if (this.gangPais.length == 4) {
    //4杠拿
    console.log('4杠拿')
    return 9999
  }

  if (this.tongArray.length > 2) {
    //3通拿
    console.log('3通拿')
    return 9999
  }
  if (this.huPaiType == 3) {
    //4大砍
    if (this.is4DK()) {
      console.log('4大砍')
      return 9999
    }
  }
  if (this.isQYS && this.length == 4) {
    //清一色大跳车
    console.log('清一色大跳车拿')
    return 9999
  }

  /** ---- 判断自定义规则大拿的牌型 ----**/

  //逢双就拿的情况，顺便把通的点数算一下
  var tongScore = getTongScore(this.tongArray, this.roomRules.isNaForDouble)
  if (tongScore == 9999) {
    console.log('双通拿')
    return 9999
  }

  //双8支情况，顺便把支子的点数算一下
  var typeScore = getTypeScore(this.allTypeNumArr, this.roomRules.isNaForDouble)
  if (typeScore == 9999) {
    console.log('双8支拿')
    return 9999
  }

  //三杠拿不拿，顺便把杠的点数计算一下
  var gangScore = getGangScore(this.gangPais, this.roomRules.isNaFor3Gang)
  if (gangScore == 9999) {
    console.log('三杠拿')
    return 9999
  }

  //清一色拿不拿
  if (this.isQYS) {
    if (this.roomRules.isNaForQYS) {
      console.log('清一色拿')
      return 9999
    }
  }

  //大跳车自摸
  if (this.pengPais.length == 4 && this.roomRules.isNaForDTCZM) {
    if (this.isZimo) {
      console.log('大跳车自摸拿')
      return 9999
    }
  }

  //31点加10点
  if (this.roomRules.isNaFor31) {
    if (this.isQYS) {
      //四核
      if (this.shNum > 0) {
        console.log('清一色+四核拿')
        return 9999
      }
      //枯枝呀
      if (this.isKZY) {
        console.log('清一色+枯枝呀拿')
        return 9999
      }
      //碰碰胡
      if (this.isPPH()) {
        console.log('清一色+鹏鹏胡拿')
        return 9999
      }
      // 不需要判断清一色+一条龙，要么是门清，要么有四核
      // if(hasDragon(allCommonHuPaiInfos)){
      //     return 9999;
      // }

      if (this.getSanDKType() >= 3) {
        console.log('清一色+三大砍拿')
        return 9999
      }
    }
    //七对的情况
    if (this.huPaiType == 2) {
      if (this.shNum > 0) {
        console.log('七对+四核拿')
        return 9999
      }
      if (this.isCYS) {
        console.log('七对+草一色拿')
        return 9999
      }
    }

    //大跳车
    if (this.pengPais.length == 4) {
      if (this.isCYS) {
        console.log('大跳车+草一色拿')
        return 9999
      }
      if (this.getSanDKType() >= 3) {
        console.log('大跳车+三大砍拿')
        return 9999
      }
    }
  }

  //三大砍带头
  if (this.roomRules.isNaForThreeKanAndTou) {
    if (this.getSanDKType() == 3.5 || this.getSanDKType() == 50.5) {
      console.log('三大砍+头拿')
      return 9999
    }
  }

  //中发白
  if (this.roomRules.isNaForZFB && this.getSanDKType() >= 50) {
    console.log('中发白拿')
    return 9999
  }

  //暗老小头
  if (this.roomRules.isNaForAnLXT) {
    var anLXTNum = this.getNumAnLXT()
    if (anLXTNum > 0) {
      console.log('安老小头拿')
      return 9999
    }
  }

  /** -------分析要计算的点数------- **/
  //七对特殊的情况
  if (this.huPaiType == 2) {
    //计算点数
    var score = 31
    score = score + typeScore + tongScore
    if (this.shNum > 0) {
      score += 10
    }
    if (this.isCYS) {
      score += 10
    }
    if (bbNumFor7P > 0) {
      score += 5
    }
    if (this.roomRules.isNaFor50Point && score >= 50) {
      console.log('50点拿')
      return 9999
    }
    if (this.isZimo) {
      return score * 2
    }
    return score
  }

  if (this.pengPais.length == 4) {
    var score = 31
    score = score + typeScore + tongScore + gangScore
    if (this.isCYS) {
      score += 10
    }
    if (this.getSanDKType() > 3) {
      score += 10
    }
    //判断碰的牌中的老小头积分
    score += getLXTScoreWithPengPais(this.pengPais)
    score += this.isGSH ? 5 : 0
    if (this.roomRules.isNaFor50Point && score >= 50) {
      console.log('50点拿')
      return 9999
    }
    if (this.isZimo) {
      return score * 2
    }
    return score
  }

  //清一色不算支子点书
  if (this.isQYS) {
    var score = 31
    if (this.shNum > 0) {
      score += 10
    }
    score += this.getScore()
    if (this.isQGH) {
      score += 5
    }
    if (this.isKZY) {
      score += 20
    }
    if (this.isGSH) {
      score += 5
    }
    if (this.roomRules.isNaFor50Point && score >= 50) {
      console.log('50点拿')
      return 9999
    }
    if (this.isZimo) {
      return score * 2
    }
    return score
  }

  var score = 4
  score = score + typeScore + tongScore + gangScore
  if (this.shNum > 0) {
    score += 10
  }
  if (this.isCYS > 0) {
    score += 10
  }
  if (this.isMenqing) {
    score += 5
  }
  score += this.getScore()
  if (this.isQGH) {
    score += 5
  }
  if (this.isKZY) {
    score += 20
  }
  if (this.isGSH) {
    score += 5
  }
  if (this.roomRules.isNaFor50Point && score >= 50) {
    console.log('50点拿')
    return 9999
  }
  if (this.isZimo) {
    return score * 2
  }
  return score
}

/***
 ** 分析出手牌+胡牌，可以组成的 将对+3张组合
 **/
HxmjUtils.prototype.getAllCommonHuPaiInfos = function() {
  var allCommonHuPaiInfos = []
  var allPais = this.shouPais.concat()
  allPais.push(this.huPai)
  allPais.sort()
  var plength = allPais.length
  for (var i = 0; i < plength; ) {
    var copyAllPais = allPais.concat()
    if (i < plength - 1 && copyAllPais[i] == copyAllPais[i + 1]) {
      //console.log('在' + i + '位置上检测到将对 ： ' + copyAllPais[i]);
      copyAllPais.splice(i, 2)
      if (CommonRules.isMatchHuWithoutJiangDui(copyAllPais)) {
        //console.log('去除将对后，满足胡牌');
        var threeInfos = getThreeInfosWithoutJiangDui(copyAllPais)
        //console.log('3张的信息为：');
        // threeInfos.forEach(function(e){
        //     console.log(e.isKanzi + ' ' + e.pai);
        // });
        var commonHuPaiInfo = new HxCommonHuPaiInfo(
          this.shouPais,
          this.pengPais,
          this.gangPais,
          this.anGangPais,
          this.huPai,
          allPais[i],
          threeInfos,
          this.isZimo,
          this.tingOnly,
          roomRules.isFengForThreeKan
        )
        allCommonHuPaiInfos.push(commonHuPaiInfo)
      } else {
        //console.log('去除将对后，但是不可以胡牌');
      }
      //console.log('----------------');
      var j = i + 2
      while (j < plength) {
        if (allPais[i] == allPais[j]) {
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
  this.allCommonHuPaiInfos = allCommonHuPaiInfos
}

function getThreeInfosWithoutJiangDui(shouPaisNoJD) {
  var threeInfos = []
  var copyShouPaisNoJD = shouPaisNoJD.concat()
  analyseThreeInfosWithoutJiangDui(copyShouPaisNoJD, threeInfos)
  return threeInfos
}
//
function analyseThreeInfosWithoutJiangDui(shouPaisNoJD, threeInfos) {
  if (shouPaisNoJD.length == 0) {
    return
  }
  if (
    shouPaisNoJD[0] == shouPaisNoJD[1] &&
    shouPaisNoJD[0] == shouPaisNoJD[2]
  ) {
    var threeInfo = new ThreeInfo(true, shouPaisNoJD[0])
    //console.log(threeInfo.isKanzi + threeInfo.pai);
    threeInfos.push(threeInfo)
    shouPaisNoJD.splice(0, 3)
    analyseThreeInfosWithoutJiangDui(shouPaisNoJD, threeInfos)
  } else {
    if (
      CommonUtils.contains(shouPaisNoJD, shouPaisNoJD[0] + 1) &&
      CommonUtils.contains(shouPaisNoJD, shouPaisNoJD[0] + 2)
    ) {
      var threeInfo = new ThreeInfo(false, shouPaisNoJD[0])
      //console.log(threeInfo.isKanzi + ' ' + threeInfo.pai);
      threeInfos.push(threeInfo)
      //console.log(this.threeInfos.length);
      CommonUtils.removeItem(shouPaisNoJD, shouPaisNoJD[0] + 1)
      CommonUtils.removeItem(shouPaisNoJD, shouPaisNoJD[0] + 2)
      CommonUtils.removeItem(shouPaisNoJD, shouPaisNoJD[0])
      analyseThreeInfosWithoutJiangDui(shouPaisNoJD, threeInfos)
    }
  }
}

HxmjUtils.prototype.getNumAnLXT = function() {
  var type = 0
  for (var i = 0; i <= this.allCommonHuPaiInfos.length - 1; i++) {
    var temp = this.allCommonHuPaiInfos[i].anLXTNum
    if (temp > type) {
      type = temp
    }
  }
  return type
}

HxmjUtils.prototype.hasDragon = function() {
  for (var i = 0; i <= this.allCommonHuPaiInfos.length - 1; i++) {
    if (allCommonHuPaiInfos[i].dragonSore == 20) {
      return true
    }
  }
  return false
}

HxmjUtils.prototype.getSanDKType = function() {
  var type = 0
  for (var i = 0; i <= this.allCommonHuPaiInfos.length - 1; i++) {
    var temp = this.allCommonHuPaiInfos[i].sdkType
    if (temp > type) {
      type = temp
    }
  }
  return type
}

HxmjUtils.prototype.canBigMo = function() {
  for (var i = 0; i <= this.allCommonHuPaiInfos.length - 1; i++) {
    if (this.allCommonHuPaiInfos[i].canBeBigMo) {
      return true
    }
  }
  return false
}

HxmjUtils.prototype.isPPH = function() {
  for (var i = 0; i <= this.allCommonHuPaiInfos.length - 1; i++) {
    if (this.allCommonHuPaiInfos[i].isPPH) {
      return true
    }
  }
  return false
}

HxmjUtils.prototype.is4DK = function() {
  for (var i = 0; i <= this.allCommonHuPaiInfos.length - 1; i++) {
    if (this.allCommonHuPaiInfos[i].hasSiDK) {
      return true
    }
  }
  return false
}

HxmjUtils.prototype.getScore = function() {
  var highScore = 0
  for (var i = 0; i < this.allCommonHuPaiInfos.length; i++) {
    var score = 0
    score += this.allCommonHuPaiInfos[i].pairsScore
    score += this.allCommonHuPaiInfos[i].dragonSore
    score += this.allCommonHuPaiInfos[i].lhScore
    score += this.allCommonHuPaiInfos[i].bbScore
    score += this.allCommonHuPaiInfos[i].lxtScore
    score += this.allCommonHuPaiInfos[i].sdkScore
    score += this.allCommonHuPaiInfos[i].pphScore
    if (score > highScore) {
      highScore = score
    }
  }
  return highScore
}

/***检测是不是门清****/
function isMenq(pengPais, anGangPais) {
  return pengPais.length == 0 || pengPais.length == anGangPais.length
}
/***判断牌组是不是幺幺胡****/
function isYYH(pengPais, shouPais, huPai) {
  var pais = pengPais.concat(shouPais)
  pais.push(huPai)
  var isAll = true
  for (var i = 0; i < pais.length; i++) {
    type = CommonRules.getPaiType(pais[i])
    if (
      type == 5 ||
      type == 4 ||
      pais[i] == 11 ||
      pais[i] == 19 ||
      pais[i] == 21 ||
      pais[i] == 29 ||
      pais[i] == 31 ||
      pais[i] == 39
    ) {
      continue
    } else {
      isAll = false
      break
    }
  }
  return isAll
}

/**
 ** 分析出四核的数量
 **/
function getSiHeNum(pengPais, shouPais, huPai) {
  var num = 0
  copyAllPais = shouPais.concat()
  copyAllPais.push(huPai)
  pengPais.forEach(function(e) {
    if (CommonUtils.contains(copyAllPais, e)) {
      num++
    }
  })
  if (copyAllPais.length < 8) {
    return num
  }
  copyAllPais.sort()
  //console.log(copyAllPais);
  for (var i = 0; i < copyAllPais.length - 3; ) {
    //console.log('... ' + i);
    var j = i + 1
    while (j < copyAllPais.length) {
      //console.log('...... ' + j);
      if (copyAllPais[j] != copyAllPais[i]) {
        break
      }
      j++
    }
    if (j - i == 4) {
      //console.log('hasSihe ' + j);
      num++
    }
    i = j
  }
  return num
}

/**
 ** 分析出现通的情况的数组
 **/
function getTongArr(pengPais, gangPais, shouPais, huPai) {
  var copyShouPais = shouPais.concat()
  copyShouPais.push(huPai)
  pengPais.forEach(function(e) {
    copyShouPais.push(e)
    copyShouPais.push(e)
    copyShouPais.push(e)
  })
  gangPais.forEach(function(e) {
    copyShouPais.push(e)
  })
  var typeNumArr = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  var paisWithNoFeng = copyShouPais.filter(function(e) {
    return e < 40
  })
  paisWithNoFeng.forEach(function(e) {
    type = e % 10
    typeNumArr[type - 1]++
  })
  var fiteA = typeNumArr.filter(function(e) {
    return e > 4
  })
  return fiteA
}

function has8tong(fiteA) {
  var filterArr = fiteA.filter(function(e) {
    return e == 8
  })
  return filterArr.length != 0
}

/**
 ** 获取所有类型牌的数量
 ** 可以根据这个结果，快速的分析出清一色和草一色
 **/
//获取所有类型牌的数量，[a,b,c,d,e,f]里面的元素代表万，筒，条，中发白，东南西北；最后一个无用
function getAllTypeNum(pengPais, gangPais, shouPais, huPai) {
  var copyShouPais = shouPais.concat()
  copyShouPais.push(huPai)
  pengPais.forEach(function(e) {
    copyShouPais.push(e)
    copyShouPais.push(e)
    copyShouPais.push(e)
  })
  gangPais.forEach(function(e) {
    copyShouPais.push(e)
  })
  var typeNumArr = [0, 0, 0, 0, 0, 0]
  copyShouPais.forEach(function(e) {
    type = CommonRules.getPaiType(e)
    typeNumArr[type - 1]++
  })
  return typeNumArr
}

//分析是不是草一色
function isCYSWithTypeArray(arr) {
  var arr1 = arr.filter(function(e, i, a) {
    return e > 0 && i < 3
  })
  var arr2 = arr.filter(function(e, i, a) {
    return e > 0 && i > 2
  })
  if (arr1.length == 1 && arr2.length > 0) {
    return true
  }
  return false
}

//分析是不是清一色
function isQYSWithTypeArray(arr) {
  var arr1 = arr.filter(function(e, i, a) {
    return e > 0 && i < 3
  })
  var arr2 = arr.filter(function(e, i, a) {
    return e > 0 && i > 2
  })
  if (arr1.length == 1 && arr2.length == 0) {
    return true
  }
  return false
}

//获取通的点数
function getTongScore(tongArr, isNaForDouble) {
  if (tongArr.length > 1 && isNaForDouble) {
    return 9999
  }
  var tongScore = 0
  if (tongArr.length == 1) {
    tongScore = tongArr[0]
  }
  if (tongArr.length == 2) {
    tongScore = tongArr[0] + tongArr[1] + 5
  }
  return tongScore
}

//获取支子点数
function getTypeScore(arr, isNaForDouble) {
  var filterArr = arr.filter(function(e, i, arr) {
    return i < 3
  })
  filterArr.push(arr[3] + arr[4])
  var filterArr2 = filterArr.filter(function(e, i, arr) {
    return e > 7
  })
  if (filterArr2.length == 0) {
    return 0
  } else {
    if (filterArr2.length == 1) {
      return filterArr2[0] - 7
    } else {
      return isNaForDouble ? 9999 : filterArr2[0] - 7 + filterArr2[1] - 7 + 5
    }
  }
}

//获取杠的点数
function getGangScore(gangPais, isNaFor3Gang) {
  if (gangPais.length == 3) {
    return isNaFor3Gang ? 9999 : 10
  }
  if (gangPais.length == 2) {
    return 5
  }
  return 0
}

function getLXTScoreWithPengPais(pengPais) {
  var num = 0
  if (
    CommonUtils.contains(pengPais, 11) &&
    CommonUtils.contains(pengPais, 19)
  ) {
    num++
  }
  if (
    CommonUtils.contains(pengPais, 21) &&
    CommonUtils.contains(pengPais, 29)
  ) {
    num++
  }
  if (
    CommonUtils.contains(pengPais, 31) &&
    CommonUtils.contains(pengPais, 39)
  ) {
    num++
  }
  return num == 0 ? 0 : num == 1 ? 5 : 15
}

module.exports = HxmjUtils

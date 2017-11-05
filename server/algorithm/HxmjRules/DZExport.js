const CommonHuPaiInfo = require('./DZHuPaiInfo')
const SevenPairHuPaiInfo = require('./DZSevenPairHuPaiInfo')
const MjUtil = require('./DZUtil')
const Action = require('./hxaction')

class Export {
  constructor(ss, ps, gs, ags, h, ht, tingPais, action, roomRules, allCs) {
    this.ss = ss
    this.ps = ps
    this.gs = gs
    this.ags = ags
    this.allCs = allCs
    this.h = h
    this.ht = ht
    console.log(ht)
    this.tingPais = tingPais
    this.tingOnly = tingPais.length == 1
    this.action = action
    this.roomRules = roomRules

    this.zm = action == Action.ACTION_ZIMO || action == Action.ACTION_GSHUA
    this.gsh = action == Action.ACTION_GSHUA
    this.qgh = action == Action.ACTION_QGHU
    this.huInfo = null
    this.util = new MjUtil(ss, ps, gs, ags, h)
    if (ht === 2) {
      this.huInfo = new SevenPairHuPaiInfo(ss, h)
    }
    if (ht === 3) {
      this.huInfo = new CommonHuPaiInfo(ss, ps, gs, ags, h)
      this.kzy = this.tingOnly && (this.qgh || isLast(this.h, this.zm, allCs))
    }
    this.mozi = this.getMozi()
    this.score = this.calculate()
  }

  getMozi() {
    if (this.ht == 1) {
      return this.gsh ? 4 : this.zm ? 2 : 0
    }
    if (this.ht == 2) {
      return this.util.qys ? (this.zm ? 6 : 2) : this.zm ? 2 : 0
    }
    if (this.zm) {
      if (this.kzy) {
        let a = this.gsh ? 18 : 10
        let b = this.gsh ? 8 : 4
        return this.util.qys ? a : b
      } else {
        let canBigMo = this.huInfo.canBigMo(this.tingOnly)
        if (this.util.qys) {
          let a = canBigMo ? 10 : 6
          let b = canBigMo ? 6 : 4
          return this.gsh ? a : b
        } else {
          let a = canBigMo ? 4 : 2
          let b = canBigMo ? 2 : 1
          return this.gsh ? a : b
        }
      }
    } else {
      return this.util.qys ? (this.kzy ? 4 : 2) : this.kzy ? 2 : 0
    }
  }

  calculate() {
    /** ---- 判断基本大拿的牌型 ----**/ //乱分拿
    if (this.ht == 1) {
      console.log('乱分拿')
      return 9999
    } //双四核拿
    if (this.util.shn >= 2) {
      console.log('双四核拿')
      return 9999
    }
    //门清清一色拿
    if (this.util.mq && this.util.qys) {
      console.log('门清清一色拿')
      return 9999
    } //8通拿
    if (this.util.et) {
      console.log('8通拿')
      return 9999
    } //幺幺胡
    if (this.util.yyh) {
      console.log('幺幺胡拿')
      return 9999
    }
    var bbNumFor7P = 0
    //7对双棒棒
    if (this.ht == 2) {
      bbNumFor7P = this.huInfo.getBBNumForSevenPairs(
        this.roomRules.isFengForThreeKan
      )
      if (bbNumFor7P == 2) {
        console.log('7对双棒棒拿')
        return 9999
      }
    } //门清碰碰胡
    if (this.ht == 3) {
      if (this.util.mq && this.huInfo.isPPH()) {
        console.log('门清碰碰胡拿')
        return 9999
      }
    } /** ---- 判断极小概率大拿的牌型（4杠／3通／4大砍 / 清一色大跳车） ----**/
    if (this.gs.length == 4) {
      //4杠拿
      console.log('4杠拿')
      return 9999
    }
    if (this.util.tongs.length > 2) {
      //3通拿
      console.log('3通拿')
      return 9999
    }
    if (this.ht == 3) {
      //4大砍
      if (this.huInfo.is4DK()) {
        console.log('4大砍')
        return 9999
      }
    }
    if (this.util.qys && this.gs.length == 4) {
      //清一色大跳车
      console.log('清一色大跳车拿')
      return 9999
    } /** ---- 判断自定义规则大拿的牌型 ----**/ //逢双就拿的情况，顺便把通的点数算一下
    var tongScore = this.util.getTongScore(this.roomRules.isNaForDouble)
    if (tongScore == 9999) {
      console.log('双通拿')
      return 9999
    } //双8支情况，顺便把支子的点数算一下
    var typeScore = this.util.getTypeScore(this.roomRules.isNaForDouble)
    if (typeScore == 9999) {
      console.log('双8支拿')
      return 9999
    } //三杠拿不拿，顺便把杠的点数计算一下
    var gangScore = this.util.getGangScore(this.roomRules.isNaFor3Gang)
    if (gangScore == 9999) {
      console.log('三杠拿')
      return 9999
    } //清一色拿不拿
    if (this.util.qys && this.roomRules.isNaForQYS) {
      console.log('清一色拿')
      return 9999
    }
    //大跳车自摸
    if (this.ps.length == 4 && this.roomRules.isNaForDTCZM && this.zm) {
      console.log('大跳车自摸拿')
      return 9999
    } //31点加10点
    if (this.roomRules.isNaFor31) {
      if (this.util.qys) {
        //四核
        if (this.util.shn > 0) {
          console.log('清一色+四核拿')
          return 9999
        }
        //枯枝呀
        if (this.kzy) {
          console.log('清一色+枯枝呀拿')
          return 9999
        } //碰碰胡
        if (this.huInfo.isPPH()) {
          console.log('清一色+鹏鹏胡拿')
          return 9999
        } // 不需要判断清一色+一条龙，要么是门清，要么有四核 // if(hasDragon(allCommonHuPaiInfos)){ //     return 9999; // }
        if (this.huInfo.getSanDKType(this.roomRules.isFengForThreeKan) >= 3) {
          console.log('清一色+三大砍拿')
          return 9999
        }
      } //七对的情况
      if (this.ht == 2) {
        if (this.util.shn > 0) {
          console.log('七对+四核拿')
          return 9999
        }
        if (this.util.cys) {
          console.log('七对+草一色拿')
          return 9999
        }
      } //大跳车
      if (this.ps.length == 4) {
        if (this.util.cys) {
          console.log('大跳车+草一色拿')
          return 9999
        }
        if (this.huInfo.getSanDKType() >= 3) {
          console.log('大跳车+三大砍拿')
          return 9999
        }
      }
    } //三大砍带头
    if (this.roomRules.isNaForThreeKanAndTou) {
      if (this.ht === 3) {
        let a = this.huInfo.getSanDKType(this.roomRules.isFengForThreeKan)
        if (a === 3.5 || a === 50.5) {
          console.log('三大砍+头拿')
          return 9999
        }
      }
    } //中发白
    if (this.roomRules.isNaForZFB) {
      if (this.ht === 3) {
        let a = this.huInfo.getSanDKType(this.roomRules.isFengForThreeKan)
        if (a >= 50) {
          console.log('中发白拿')
          return 9999
        }
      }
    } //暗老小头
    if (this.roomRules.isNaForAnLXT) {
      if (this.ht === 3 && this.huInfo.getNumAnLXT() > 0) {
        console.log('安老小头拿')
        return 9999
      }
    } /** -------分析要计算的点数------- **/ //七对特殊的情况
    if (this.ht == 2) {
      //计算点数
      var score = 31
      score = score + typeScore + tongScore
      if (this.util.shn > 0) {
        score += 10
      }
      if (this.util.cys) {
        score += 10
      }
      if (bbNumFor7P > 0) {
        score += 5
      }
      if (this.roomRules.isNaFor50Point && score >= 50) {
        console.log('50点拿')
        return 9999
      }
      if (this.zm) {
        return score * 2
      }
      return score
    }
    if (this.ps.length == 4) {
      var score = 31
      score = score + typeScore + tongScore + gangScore
      if (this.util.cys) {
        score += 10
      }
      if (this.huInfo.getSanDKType() > 3) {
        score += 10
      } //判断碰的牌中的老小头积分
      score += getLXTScoreWithPengPais(this.ps)
      score += this.gsh ? 5 : 0
      if (this.roomRules.isNaFor50Point && score >= 50) {
        console.log('50点拿')
        return 9999
      }
      if (this.isZimo) {
        return score * 2
      }
      return score
    } //清一色不算支子点书
    if (this.util.qys) {
      var score = 31

      if (this.util.shn > 0) {
        score += 10
      }
      score += this.huInfo.getScore(
        this.tingOnly,
        this.zm,
        this.roomRules.isFengForThreeKan
      )
      if (this.qgh) {
        score += 5
      }
      if (this.kzy) {
        score += 20
      }
      if (this.gsh) {
        score += 5
      }
      if (this.roomRules.isNaFor50Point && score >= 50) {
        console.log('50点拿')
        return 9999
      }
      if (this.zm) {
        return score * 2
      }
      return score
    }
    var score = 4
    score = score + typeScore + tongScore + gangScore
    if (this.util.shn > 0) {
      score += 10
    }
    if (this.util.cys > 0) {
      score += 10
    }
    if (this.util.mq) {
      score += 5
    }
    score += this.huInfo.getScore(
      this.tingOnly,
      this.zm,
      this.roomRules.isFengForThreeKan
    )
    if (this.qgh) {
      score += 5
    }
    if (this.kzy) {
      score += 20
    }
    if (this.gsh) {
      score += 5
    }
    if (this.roomRules.isNaFor50Point && score >= 50) {
      console.log('50点拿')
      return 9999
    }
    if (this.zm) {
      return score * 2
    }
    return score
  }
}

function getLXTScoreWithPengPais(pengPais) {
  let num = 0
  if (
    pengPais.findIndex(s => s == 11) >= 0 &&
    pengPais.findIndex(s => s == 19) >= 0
  ) {
    num++
  }
  if (
    pengPais.findIndex(s => s == 21) >= 0 &&
    pengPais.findIndex(s => s == 29) >= 0
  ) {
    num++
  }
  if (
    pengPais.findIndex(s => s == 31) >= 0 &&
    pengPais.findIndex(s => s == 39) >= 0
  ) {
    num++
  }
  return num == 0 ? 0 : num == 1 ? 5 : 15
}

/**
  ** --- 绝Y检测 ---
  ** 检测是不是枯枝丫
  ** 当只听一张牌的时候，且是最后一张的时候
  **/

function isLast(huPai, isZimo, allChupais) {
  var filterHupais = allChupais.filter(e => e === huPai)
  if (isZimo) {
    return filterHupais.length === 3
  } else {
    return filterHupais.length === 4
  }
}

module.exports = Export

const Action = require('./hxaction')
const CommonRules = require('./CommonRules')
const DZExport = require('./DZExport')
require('colors')

const paisArr = [
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  21,
  21,
  21,
  21,
  22,
  22,
  22,
  22,
  23,
  23,
  23,
  23,
  24,
  24,
  24,
  24,
  25,
  25,
  25,
  25,
  26,
  26,
  26,
  26,
  27,
  27,
  27,
  27,
  28,
  28,
  28,
  28,
  29,
  29,
  29,
  29,
  31,
  31,
  31,
  31,
  32,
  32,
  32,
  32,
  33,
  33,
  33,
  33,
  34,
  34,
  34,
  34,
  35,
  35,
  35,
  35,
  36,
  36,
  36,
  36,
  37,
  37,
  37,
  37,
  38,
  38,
  38,
  38,
  39,
  39,
  39,
  39,
  41,
  41,
  41,
  41,
  43,
  43,
  43,
  43,
  45,
  45,
  45,
  45,
  47,
  47,
  47,
  47,
  51,
  51,
  51,
  51,
  53,
  53,
  53,
  53,
  55,
  55,
  55,
  55
]

//判断牌组是不是缺一门
function isQueOK(shouPais, desPai, QueType) {
  let pais = shouPais.concat()
  pais.push(desPai)
  return pais.every(e => CommonRules.getPaiType(e) !== QueType)
}

//ln为剩余牌的数量，当ln >= 4的时候才能碰；当ln > 4的时候才能杠
exports.getActions = function(shouPais, pengPais, action, desPai, QueType, ln) {
  var actions = []
  let desType = CommonRules.getPaiType(desPai)
  let queOk = isQueOK(shouPais, desPai, QueType)
  switch (action) {
    //别人出的牌，只能产生，炮胡，碰，碰杠
    case Action.ACTION_CHU:
      //出的花色是缺的花色，则不做处理
      if (desType !== QueType) {
        if (queOk) {
          if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
            actions.push(Action.makeupAction(Action.ACTION_PAOHU, desPai))
          }
        }
        var num = CommonRules.getPaiNum(shouPais, desPai)
        if (num == 3) {
          if (ln > 4) {
            actions.push(Action.makeupAction(Action.ACTION_PGANG, desPai))
          }
          if (ln >= 4) {
            actions.push(Action.makeupAction(Action.ACTION_PENG, desPai))
          }
        } else if (num == 2) {
          if (ln >= 4) {
            actions.push(Action.makeupAction(Action.ACTION_PENG, desPai))
          }
        }
      }
      break //别人弯杠的牌，只能产生抢杠胡
    case Action.ACTION_WGANG:
      if (desType !== QueType && queOk) {
        if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
          actions.push(Action.makeupAction(Action.ACTION_QGHU, desPai))
        }
      }
      break //自己摸的牌，只能产生，自摸，暗杠，弯杠
    case Action.ACTION_MO:
      //自摸检测
      if (desType !== QueType && queOk) {
        if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
          actions.push(Action.makeupAction(Action.ACTION_ZIMO, desPai))
        }
      }
      //弯杠检测
      var wgpais = CommonRules.getWanGangPais(shouPais, desPai, pengPais)
      if (wgpais.length > 0) {
        wgpais.forEach(function(e) {
          if (CommonRules.getPaiType(e) !== QueType) {
            if (ln > 4) {
              actions.push(Action.makeupAction(Action.ACTION_WGANG, e))
            }
          }
        })
      } //暗杠检测
      var agpais = CommonRules.getAnGangPais(shouPais, desPai)
      if (agpais.length > 0) {
        agpais.forEach(function(e) {
          if (CommonRules.getPaiType(e) !== QueType) {
            if (ln > 4) {
              actions.push(Action.makeupAction(Action.ACTION_ANGANG, e))
            }
          }
        })
      }
      break //杠摸，只能产生，杠上花，暗杠，弯杠
    case Action.ACTION_GMO:
      //自摸检测
      if (desType !== QueType && queOk) {
        if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
          actions.push(Action.makeupAction(Action.ACTION_GSHUA, desPai))
        }
      } //弯杠检测
      var wgpais = CommonRules.getWanGangPais(shouPais, desPai, pengPais)
      if (wgpais.length > 0) {
        wgpais.forEach(function(e) {
          if (CommonRules.getPaiType(e) !== QueType) {
            if (ln > 4) {
              actions.push(Action.makeupAction(Action.ACTION_WGANG, e))
            }
          }
        })
      } //暗杠检测
      var agpais = CommonRules.getAnGangPais(shouPais, desPai)
      if (agpais.length > 0) {
        agpais.forEach(function(e) {
          if (CommonRules.getPaiType(e) !== QueType) {
            if (ln > 4) {
              actions.push(Action.makeupAction(Action.ACTION_ANGANG, e))
            }
          }
        })
      }
      break
    default:
      break
  } // (shouPais, pengPais, action, desPai, QueType)
  if (actions.length > 0) {
    actions.push(Action.makeupAction(Action.ACTION_CANCEL, desPai))
  }
  console.log(
    shouPais.join(', '),
    'P:',
    pengPais.join(', '),
    'Que:',
    QueType,
    '&',
    desPai,
    'Action:',
    action,
    '->',
    actions
  )
  return actions
} //136张牌随机排列
exports.getRandomPais = function() {
  var pais = paisArr.concat()
  var len = paisArr.length
  for (var i = 0; i <= len - 1; i++) {
    var idx = Math.floor(Math.random() * (len - i))
    var temp = pais[idx]
    pais[idx] = pais[len - i - 1]
    pais[len - i - 1] = temp
  }
  return pais
} //根据排列好的牌，从庄家开始分配牌，4441的形式
exports.getUserPais = function(pais) {
  var usersPais = []
  var user0Pais = []
  var user1Pais = []
  var user2Pais = []
  var user3Pais = []
  if (pais.length == 136) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 4; i++) {
        user0Pais.push(pais.pop())
      }
      for (var i = 0; i < 4; i++) {
        user1Pais.push(pais.pop())
      }
      for (var i = 0; i < 4; i++) {
        user2Pais.push(pais.pop())
      }
      for (var i = 0; i < 4; i++) {
        user3Pais.push(pais.pop())
      }
    }
    user0Pais.push(pais.pop())
    user1Pais.push(pais.pop())
    user2Pais.push(pais.pop())
    user3Pais.push(pais.pop())
    user0Pais.push(pais.pop())
    user0Pais.sort()
    user1Pais.sort()
    user2Pais.sort()
    user3Pais.sort()
    usersPais.push(user0Pais)
    usersPais.push(user1Pais)
    usersPais.push(user2Pais)
    usersPais.push(user3Pais)
  }
  return usersPais
} //计算积分
exports.getScore = function(
  pengPais,
  gangPais,
  anGangPais,
  shouPais,
  action,
  huPai,
  allChupais,
  roomRules,
  QueType
) {
  var huPaiType = CommonRules.getHuType(pengPais, shouPais, huPai, QueType)
  var tingPais = CommonRules.getTingPais(shouPais, pengPais)
  let dzExport = new DZExport(
    shouPais,
    pengPais,
    gangPais,
    anGangPais,
    huPai,
    huPaiType,
    tingPais,
    action,
    roomRules,
    allChupais
  )
  let result = []
  result.push(dzExport.score)
  result.push(dzExport.mozi)
  return result
} // var shouPais = [11,11,11,12,13,14,15,16,17,18,19,19,19]; // console.log(CommonRules.getTingPais(shouPais, [])); //console.log(paisArr.length); // var pais = exports.getRandomPais(); // var usersPais = exports.getUserPais(pais) // console.log(usersPais); //console.log(pais);

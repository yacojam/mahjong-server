var Action = {}
Action.ACTION_CHU = 1 //出牌
Action.ACTION_PENG = 2 //碰牌
Action.ACTION_PAOHU = 3 //普通炮胡（胡别人出的牌）
Action.ACTION_QGHU = 4 //抢杠胡（胡别人弯杠出来的牌）
Action.ACTION_ZIMO = 5 //普通自摸
Action.ACTION_GSHUA = 6 //杠上花（杠的时候，自摸）
Action.ACTION_WGANG = 7 //弯杠（杠自己已经碰出去的牌）
Action.ACTION_PGANG = 8 //碰杠（杠别人打出来的牌）
Action.ACTION_ANGANG = 9 //暗杠（自己有4个的杠）
Action.ACTION_MO = 10
//普通摸牌
Action.ACTION_GMO = 11 //杠之后摸的牌
Action.ACTION_DINGQUE = 12
Action.ACTION_CANCEL = -1
Action.actionDetail = function(action, pai) {
  this.pAction = action
  this.pai = pai
}
Action.makeupAction = function(action, pai) {
  var detailAction = new Action.actionDetail(action, pai)
  return detailAction
}
module.exports = Action

const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')

async function gang(action, anGang = false) {
  const { user, room, pai } = action
  user.actions = []
  if (anGang) {
    user.anGangPais.push(pai)
  } else {
    user.gangPais.push(pai)
  }
  const moPai = room.leftPais.shift()
  const actions = HXMJManager.getActions(
    user.shouPais,
    user.pengPais,
    Action.ACTION_GMO,
    moPai,
    user.que
  )
  if (actions.length === 0) {
    actions.push(Action.makeupAction(Action.ACTION_CHU, 0))
  }
  user.actions = actions
  user.shouPais = utils.removePai(user.shouPais, pai, 3)
  user.shouPais.push(moPai)
  return room
}

module.exports = gang

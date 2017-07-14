const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')

async function angang(action) {
  const { user, pai, room } = action
  user.anGangPais.push(pai)
  user.shouPais = utils.removePai(user.shouPais, pai, 4)
  user.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
  return room
}

module.exports = angang

// peng
const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')

async function peng(action) {
  const { user, room, pai } = action
  user.pengPais.push(pai)
  user.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
  user.shouPais = utils.removePai(user.shouPais, pai, 2)
  room.index = room.users.findIndex(u => u.uid === user.uid)
  return room
}

module.exports = peng

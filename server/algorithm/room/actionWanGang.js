const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')

async function wangang(action) {
  const { user, room, pai } = action
  const users = room.users
  user.gangPais.push(pai)
  user.pengPais = utils.removePai(user.pengPais, pai)
  utils.otherUserAction(room, Action.ACTION_WGANG)
  return room
}

module.exports = wangang

const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
require('colors')

async function chupai(action) {
  const { user, room, pai } = action
  const users = room.users
  user.chuPais.push(pai)

  // remove pai from shou pai
  user.shouPais = utils.removePai(user.shouPais, pai, 1)
  user.shouPais.sort((a, b) => a - b)

  await utils.otherUserAction(room, Action.ACTION_CHU, pai)
  return room
}

module.exports = chupai

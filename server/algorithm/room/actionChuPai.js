const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
require('colors')

async function chupai(action) {
  const { user, room, pai } = action
  const users = room.users
  const currentIndex = users.findIndex(u => u.uid === user.uid)
  const currentUser = users[currentIndex]
  currentUser.chuPais.push(pai)

  // remove pai from shou pai
  const paiIndex = currentUser.shouPais.findIndex(p => p === pai)
  currentUser.shouPais.splice(paiIndex, 1)
  currentUser.shouPais.sort((a, b) => a - b)

  // clear user actions
  users.forEach(u => (u.actions = []))

  let hasAction = false
  users.forEach(u => {
    if (u.uid === user.uid) {
      return
    }
    u.actions = HXMJManager.getActions(
      u.shouPais,
      u.pengPais,
      action.type,
      pai,
      u.que
    )
    hasAction = hasAction || u.actions.length > 0
  })

  if (!hasAction) {
    // other users have not actions, next user mopai
    utils.nextUser(room, currentIndex)
  }
  return room
}

module.exports = chupai

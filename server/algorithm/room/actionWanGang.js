const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')

async function wangang(action) {
  const { user, room, pai } = action
  const users = room.users
  user.gangPais.push(pai)
  user.pengPais = utils.removePai(user.pengPais, pai)
  // check others' ACTION_HU state
  users.forEach(u => (u.actions = []))
  let hasAction = false
  users.forEach(u => {
    if (u.uid === user.uid) {
      return
    }
    u.actions = HXMJManager.getActions(
      u.shouPais,
      u.pengPais,
      Action.ACTION_GMO,
      pai,
      u.que
    )
    hasAction = hasAction || u.actions.length > 0
  })

  if (!hasAction) {
    const currentIndex = users.findIndex(u => u.uid === user.uid)
    utils.nextUser(room, currentIndex)
  }
  return room
}

module.exports = wangang

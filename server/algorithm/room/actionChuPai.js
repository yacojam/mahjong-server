const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
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
    u.actions = HXMJManager.getActions(u.shouPais, u.pengPais, action.type, pai)
    hasAction = hasAction || u.actions.length > 0
  })

  if (!hasAction) {
    // other users have not actions, next user mopai
    const nextUser = users[(currentIndex + 1) % users.length]
    const moPai = room.leftPais.shift()
    nextUser.actions = HXMJManager.getActions(
      nextUser.shouPais,
      nextUser.pengPais,
      Action.ACTION_MO,
      moPai
    )
    nextUser.shouPais.push(moPai)
    if (nextUser.actions.length === 0) {
      nextUser.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
    }
  }
  return room
}

module.exports = chupai

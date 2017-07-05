// peng
const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')

async function peng(action) {
  const { user, room, pai } = action
  const currentUser = room.users.find(u => u.uid === user.uid)
  // check if other user has action or pending action
  let waitForOtherUserAction = false
  room.users.forEach(u => {
    if (u.actions.length > 0 && !u.pendingAction) {
      waitForOtherUserAction = true
    }
  })

  if (waitForOtherUserAction) {
    currentUser.pendingAction = Action.makeupAction(action.type, pai)
  } else {
    // all user has acted
    utils.filterUserAction(room)
    // remove user actions & pendingAction
    room.user.forEach(u => {
      u.actions = []
      u.pendingAction = null

      if (u.validAction) {
        if (u.validAction.pAction === Action.ACTION_PENG) {
          u.pengPais.push(pai)
          u.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
        }
      }
    })
  }
  return room
}

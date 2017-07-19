const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
const actionPeng = require('./actionPeng')
const actionHu = require('./actionHu')
const actionGang = require('./actionGang')

function cancelledForMo(actions) {
  let ret = false
  for (let action of actions) {
    if (
      action.pAction === Action.ACTION_WGANG ||
      action.pAction === Action.ACTION_ANGANG ||
      action.pAction === Action.ACTION_ZIMO ||
      action.pAction === Action.ACTION_GSHUA
    ) {
      ret = true
      break
    }
  }
  return ret
}

async function filter(action) {
  let { user, room, pai } = action
  if (action.type === Action.ACTION_CANCEL) {
    //如果是自己摸的牌cancel
    if (cancelledForMo(user.actions)) {
      user.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
      return room
    }
    user.actions = []
    user.pendingAction = null
  } else {
    user.pendingAction = Action.makeupAction(action.type, pai)
    user.actions = [user.pendingAction]
  }
  // check if all user done
  const allDone = room.users.every(
    u => u.actions.length === 0 || u.pendingAction
  )
  if (allDone) {
    // filter valid action
    utils.filterUserAction(room)
    let hasAction = false
    room.users.forEach(async u => {
      u.actions = []
      u.pendingAction = null
      if (u.validAction) {
        hasAction = true
        action.user = u
        const a = u.validAction.pAction
        if (a === Action.ACTION_PENG) {
          room = await actionPeng(action)
        }
        if (a === Action.ACTION_PGANG) {
          room = await actionGang(action)
        }

        if (a === Action.ACTION_PAOHU || a === Action.ACTION_QGHU) {
          room = await actionHu(action)
        }
      }
    })

    // all user cancel action
    if (!hasAction) {
      utils.nextUser(room)
    }
  }
  return room
}

module.exports = filter

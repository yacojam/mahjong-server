const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
const actionPeng = require('./actionPeng')
const actionHu = require('./actionHu')
const actionGang = require('./actionGang')
const Pend = require('../HxmjRules/pendingtype')

function getPriority(pAction) {
  if (pAction === Action.ACTION_PAOHU || pAction === Action.ACTION_QGHU) {
    return 2
  }
  if (pAction === Action.ACTION_PENG || pAction === Action.ACTION_PGANG) {
    return 1
  }
  return 0
}

function checkUserLeft(room, action) {
  let priority = getPriority(action.type)
  let index = room.index
  let { user } = action
  let actionIndex = room.users.findIndex(u => u.uid === user.uid)
  let ret = true
  let nextIndex = (index + 1) % room.users.length
  while (nextIndex !== actionIndex) {
    let nextUser = room.users[nextIndex]
    if (nextUser.actions.length > 0) {
      if (nextIndex.pendingAction == null) {
        nextUser.actions.forEach(a => {
          if (getPriority(a.pAction) >= priority) {
            ret = false
          }
        })
      }
    }
    if (!ret) {
      break
    }
    nextIndex = (nextIndex + 1) % room.users.length
  }
  console.log('user left check result ' + ret)
  return ret
}

function checkUserRight(room, action) {
  let priority = getPriority(action.type)
  let index = room.index
  let { user } = action
  let actionIndex = room.users.findIndex(u => u.uid === user.uid)
  let ret = true
  let nextIndex = (actionIndex + 1) % room.users.length
  while (nextIndex !== index) {
    let nextUser = room.users[nextIndex]
    if (nextUser.actions.length > 0) {
      if (nextIndex.pendingAction == null) {
        nextUser.actions.forEach(a => {
          if (getPriority(a.pAction) > priority) {
            ret = false
          }
        })
      }
    }
    if (!ret) {
      break
    }
    nextIndex = (nextIndex + 1) % room.users.length
  }
  console.log('user left check result ' + ret)
  return ret
}

function checkPendingDone(room, action) {
  if (checkUserLeft(room, action) && checkUserRight(room, action)) {
    let index = room.index
    let nextIndex = (index + 1) % room.users.length
    let result = -1
    let maxPriority = 0
    while (nextIndex !== index) {
      let nextUser = room.users[nextIndex]
      if (nextUser.pendingAction) {
        let curp = getPriority(nextUser.pendingAction.pAction)
        if (curp > maxPriority) {
          result = nextIndex
          maxPriority = curp
        }
      }
      nextIndex = (nextIndex + 1) % room.users.length
    }
    console.log('action user index ' + result)
    //all user action cancelled
    if (maxPriority === 0) {
      return 4
    } else {
      return result
    }
  }
  return -1
}

async function filter(action) {
  let { user, room, pai } = action
  if (
    action.type === Action.ACTION_CANCEL &&
    room.pendingType === Pend.PENDING_TYPE_MO
  ) {
    //如果是自己摸的牌cancel
    user.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
    room.pendingType = Pend.PENDING_TYPE_NULL
    return room
  }

  user.pendingAction = Action.makeupAction(action.type, pai)
  user.actions = [user.pendingAction]

  // check if all user done
  let realActionIndex = checkPendingDone(room, action)
  //still pending
  if (realActionIndex === -1) {
    return room
  }
  // all cancelled
  if (realActionIndex === 4) {
    room.users.forEach(u => {
      u.actions = []
      u.pendingAction = null
    })
    if (room.pendingType === Pend.PENDING_TYPE_WGANG) {
      await utils.moAction(room, Action.ACTION_GMO)
    }
    if (room.pendingType === Pend.PENDING_TYPE_CHU) {
      await utils.nextUser(room)
    }
    return room
  }

  // filter valid action
  room.users.forEach((u, idx) => {
    if (idx !== realActionIndex) {
      u.actions = []
      u.pendingAction = null
    }
  })
  let actionUser = room.users[realActionIndex]
  let a = actionUser.pendingAction.pAction
  console.log(a)
  action.user = actionUser
  if (a === Action.ACTION_PENG) {
    room = await actionPeng(action)
  }
  if (a === Action.ACTION_PGANG) {
    room = await actionGang(action)
  }

  if (a === Action.ACTION_PAOHU || a === Action.ACTION_QGHU) {
    room = await actionHu(action)
  }
  return room
}

module.exports = filter

const paiAction = require('../../algorithm/HxmjRules/hxaction')
const Pending = require('../../algorithm/HxmjRules/pendingtype')
const Publish = require('../dataflow/publish')
const Next = require('./next')
const actionChu = require('./subhandler/actionChu')
const actionGang = require('./subhandler/actionGang')
const actionHu = require('./subhandler/actionHu')
const actionWanGang = require('./subhandler/actionWanGang')
const actionMoCancel = require('./subhandler/actionMoCancel')
const CommonRules = require('../../algorithm/HxmjRules/CommonRules')

function checkValidAction(room, seat, action) {
  console.log(seat)
  let { pAction, pai } = action
  if (pAction === paiAction.ACTION_CHU) {
    let isExist =
      seat.shouPais.some(p => p === pai) &&
      seat.actions.some(a => a.pAction === paiAction.ACTION_CHU)
    if (isExist) {
      if (
        CommonRules.getPaiType(pai) !== seat.que &&
        seat.shouPais.some(p => CommonRules.getPaiType(pai) === seat.que)
      ) {
        return false
      }
      return true
    } else {
      return false
    }
  } else if (
    pAction === paiAction.ACTION_CANCEL ||
    pAction === paiAction.ACTION_DINGQUE
  ) {
    return seat.actions.some(a => a.pAction === pAction)
  } else {
    return seat.actions.some(a => a.pAction === pAction && a.pai === pai)
  }
}

async function handle(room, uid, action) {
  let seat = room.seats.find(s => s.userid === uid)
  let actionValid = checkValidAction(room, seat, action)
  if (!actionValid) {
    return
  }
  if (action.pAction === paiAction.ACTION_CHU) {
    await actionChu(room, seat, action)
  } else {
    await handlePendingAction(room, seat, action)
  }
}

async function handlePendingAction(room, seat, action) {
  //dingque pending
  if (
    action.pAction === paiAction.ACTION_DINGQUE &&
    room.pendingType === Pending.PENDING_TYPE_QUE
  ) {
    seat.pendingAction = paiAction.makeupAction(
      paiAction.ACTION_DINGQUE,
      action.que
    )
    //all use dingque ok
    if (room.seats.every(s => s.pendingAction != null)) {
      room.pendingType = Pending.PENDING_TYPE_NULL
      room.seats.forEach(s => {
        s.que = s.pendingAction.que
        s.pendingAction = null
        s.actions = []
      })
      await Publish.publishDingqueResult(room)
      await Next.startAction(room)
    }
  }

  //mo pending
  if (room.pendingType === Pending.PENDING_TYPE_MO) {
    if (action.pAction === paiAction.ACTION_ANGANG) {
      await actionGang(room, seat, action, true)
    }
    if (
      action.pAction === paiAction.ACTION_GSHUA ||
      action.pAction === paiAction.ACTION_ZIMO
    ) {
      await actionHu(room, seat, action)
    }
    if (action.pAction === paiAction.ACTION_WGANG) {
      await actionWanGang(room, seat, action)
    }
    if (action.pAction === paiAction.ACTION_CANCEL) {
      await actionMoCancel(room, seat, action)
    }
  }

  //chu/wangang pending
  if (
    (room.pendingType === Pending.PENDING_TYPE_WGANG ||
      room.pendingType === Pending.PENDING_TYPE_CHU) &&
    (action.pAction === paiAction.ACTION_CANCEL ||
      action.pAction === paiAction.ACTION_PENG ||
      action.pAction === paiAction.ACTION_PGANG ||
      action.pAction === paiAction.ACTION_PAOHU ||
      action.pAction === paiAction.ACTION_QGHU)
  ) {
    seat.pendingAction = paiAction.makeupAction(action.pAction, action.pai)
    seat.actions = [seat.pendingAction]

    // check if all user done
    let realActionIndex = checkPendingDone(room, seat, action)
    //still pending
    if (realActionIndex === -1) {
      return
    }
    // all cancelled
    if (realActionIndex === 4) {
      room.seats.forEach(u => {
        u.actions = []
        u.pendingAction = null
      })
      if (room.pendingType === Pend.PENDING_TYPE_WGANG) {
        await Next.moAction(room, Action.ACTION_GMO, true)
      }
      if (room.pendingType === Pend.PENDING_TYPE_CHU) {
        await Next.nextUser(room)
      }
      return
    }

    // filter valid action
    room.seats.forEach((u, idx) => {
      if (idx !== realActionIndex) {
        u.actions = []
        u.pendingAction = null
      }
    })
    let actionUser = room.seats[realActionIndex]
    let a = actionUser.pendingAction.pAction
    console.log(a)
    if (a === Action.ACTION_PENG) {
      room = await actionPeng(room, actionUser, actionUser.pendingAction)
    }
    if (a === Action.ACTION_PGANG) {
      room = await actionGang(room, actionUser, actionUser.pendingAction)
    }

    if (a === Action.ACTION_PAOHU || a === Action.ACTION_QGHU) {
      room = await actionHu(room, actionUser, actionUser.pendingAction)
    }
  }
}

function getPriority(pAction) {
  if (pAction === Action.ACTION_PAOHU || pAction === Action.ACTION_QGHU) {
    return 2
  }
  if (pAction === Action.ACTION_PENG || pAction === Action.ACTION_PGANG) {
    return 1
  }
  return 0
}

function checkUserLeft(room, seat, action) {
  let priority = getPriority(action.pAction)
  let index = room.index
  let actionIndex = room.seats.findIndex(u => u.userid === seat.userid)
  let ret = true
  let nextIndex = (index + 1) % room.seats.length
  while (nextIndex !== actionIndex) {
    let nextUser = room.seats[nextIndex]
    if (nextUser.actions.length > 0) {
      if (nextUser.pendingAction == null) {
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
    nextIndex = (nextIndex + 1) % room.seats.length
  }
  console.log('user left check result ' + ret)
  return ret
}

function checkUserRight(room, seat, action) {
  let priority = getPriority(action.pAction)
  let index = room.index
  let actionIndex = room.seats.findIndex(u => u.userid === seat.userid)
  let ret = true
  let nextIndex = (actionIndex + 1) % room.seats.length
  while (nextIndex !== index) {
    let nextUser = room.seats[nextIndex]
    if (nextUser.actions.length > 0) {
      if (nextUser.pendingAction == null) {
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
    nextIndex = (nextIndex + 1) % room.seats.length
  }
  console.log('user left check result ' + ret)
  return ret
}

function checkPendingDone(room, seat, action) {
  if (checkUserLeft(room, seat, action) && checkUserRight(room, seat, action)) {
    let index = room.index
    let nextIndex = (index + 1) % room.seats.length
    let result = -1
    let maxPriority = 0
    while (nextIndex !== index) {
      let nextUser = room.seats[nextIndex]
      if (nextUser.pendingAction) {
        let curp = getPriority(nextUser.pendingAction.pAction)
        if (curp > maxPriority) {
          result = nextIndex
          maxPriority = curp
        }
      }
      nextIndex = (nextIndex + 1) % room.seats.length
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

module.exports = handle

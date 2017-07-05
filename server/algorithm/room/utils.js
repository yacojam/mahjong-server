const Action = require('../HxmjRules/hxaction')

const actionPriority = {
  [Action.ACTION_PENG]: 1,
  [Action.ACTION_PGANG]: 1,
  [Action.ACTION_PAOHU]: 2,
  [Action.ACTION_QGHU]: 2
}

function filterUserAction(room) {
  let maxPriority = 0
  room.users.forEach(u => {
    if (u.pendingAction) {
      maxPriority = Math.max(
        actionPriority[u.pendingAction.pAction],
        maxPriority
      )
    }
  })
  room.users.forEach(u => {
    if (
      u.pendingAction &&
      actionPriority[u.pendingAction.pAction] === maxPriority
    ) {
      u.validAction = u.pendingAction
    }
  })
}

function removePai(pais, pai, count = 1) {
  const rets = []
  let cnt = 0
  pais.forEach(p => {
    if (p !== pai || ++cnt > count) {
      rets.push(p)
    }
  })
  return rets
}

module.exports = {
  filterUserAction,
  removePai
}

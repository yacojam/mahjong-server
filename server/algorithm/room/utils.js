const Action = require('../HxmjRules/hxaction')
const HXMJManager = require('../HxmjRules/HxmjManager')

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
    } else {
      u.validAction = null
    }
  })
}

function nextUser(room) {
  const index = (room.index = (room.index + 1) % room.users.length)
  const nextUser = room.users[index]
  const moPai = room.leftPais.shift()
  nextUser.actions = HXMJManager.getActions(
    nextUser.shouPais,
    nextUser.pengPais,
    Action.ACTION_MO,
    moPai,
    nextUser.que
  )
  nextUser.shouPais.push(moPai)
  if (nextUser.actions.length === 0) {
    nextUser.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
  }
  return room
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

async function startGame(room) {
  const pais = HXMJManager.getRandomPais()
  const userPais = HXMJManager.getUserPais(pais)
  room.users.forEach((user, idx) => {
    user.shouPais = userPais[idx]
    user.chuPais = []
    user.pengPais = []
    user.gangPais = []
    user.anGangPais = []
    user.score = null
    user.que = null
    user.actions = [Action.makeupAction(Action.ACTION_DINGQUE, 0)]
  })
  room.state = null
  room.leftPais = pais
  return room
}

async function otherUserAction(room, pAction, pai) {
  const users = room.users
  users.forEach(u => (u.actions = []))
  let hasAction = false
  users.forEach((u, index) => {
    if (index === room.index) {
      return
    }
    u.actions = HXMJManager.getActions(
      u.shouPais,
      u.pengPais,
      pAction,
      pai,
      u.que
    )
    hasAction = hasAction || u.actions.length > 0
  })

  if (!hasAction) {
    nextUser(room)
  }
}

module.exports = {
  filterUserAction,
  removePai,
  nextUser,
  startGame,
  otherUserAction
}

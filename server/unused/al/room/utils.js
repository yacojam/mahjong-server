const Action = require('../HxmjRules/hxaction')
const HXMJManager = require('../HxmjRules/HxmjManager')
const Pend = require('../HxmjRules/pendingtype')

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

async function nextUser(room) {
  const index = (room.index = (room.index + 1) % room.users.length)
  room.index = index
  await moAction(room, Action.ACTION_MO)
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
    user.state = null
  })
  room.state = null
  room.index = 0
  room.leftPais = pais
  room.pendingType = Pend.PENDING_TYPE_NULL
  return room
}

async function moAction(room, pAction) {
  let user = room.users[room.index]
  let moPai = room.leftPais.shift()
  let actions = HXMJManager.getActions(
    user.shouPais,
    user.pengPais,
    pAction,
    moPai,
    user.que
  )
  if (actions.length === 0) {
    actions.push(Action.makeupAction(Action.ACTION_CHU, 0))
  } else {
    room.pendingType = Pend.PENDING_TYPE_MO
  }
  user.actions = actions
  user.shouPais.push(moPai)
}

async function otherUserAction(room, pAction, pai, wanGang = false) {
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
    if (wanGang) {
      await moAction(room, Action.ACTION_GMO)
    } else {
      await nextUser(room)
    }
  } else {
    if (wanGang) {
      room.pendingType = Pend.PENDING_TYPE_WGANG
    } else {
      room.pendingType = Pend.PENDING_TYPE_CHU
    }
  }
}

module.exports = {
  moAction,
  filterUserAction,
  removePai,
  nextUser,
  startGame,
  otherUserAction
}

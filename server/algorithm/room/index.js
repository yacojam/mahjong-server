const actionTypes = require('../actiontypes')
const paiAction = require('../HxmjRules/hxaction')
const states = require('../states')
const User = require('../user')

const actionUserJoin = require('./actionUserJoin')
const actionDingQue = require('./actionDingQue')
const actionChuPai = require('./actionChuPai')
const actionPeng = require('./actionPeng')
const actionHu = require('./actionHu')
const actionWanGang = require('./actionWanGang')
const actionGang = require('./actionGang')

function create(id) {
  return {
    id,
    index: 0,
    game: null,
    users: [],
    state: actionTypes.ROOM_STATE_INIT
  }
}

async function reducer(room, action) {
  if (action.type === actionTypes.ACTION_ROOM_USER_JOIN) {
    const user = action.user || {
      uid: action._uid,
      name: action._uid
    }
    room = await actionUserJoin(room, user)
  }

  if (action.type === paiAction.ACTION_DINGQUE) {
    room = await actionDingQue(action)
  }

  if (action.type === paiAction.ACTION_CHU) {
    room = await actionChuPai(action)
  }

  if (action.type === paiAction.ACTION_PENG) {
    room = await actionPeng(action)
  }

  if (
    action.type === paiAction.ACTION_PAOHU ||
    action.type === paiAction.ACTION_ZIMO ||
    action.type === paiAction.ACTION_GSHUA ||
    action.type === paiAction.ACTION_QGHU
  ) {
    room = await actionHu(action)
  }

  if (action.type === paiAction.ACTION_WGANG) {
    room = await actionWanGang(action)
  }

  if (
    action.type === paiAction.ACTION_PGANG ||
    action.type === paiAction.ACTION_ANGANG
  ) {
    room = await actionGang(action, action.type === paiAction.ACTION_ANGANG)
  }

  return room
}

module.exports = {
  create,
  reducer
}

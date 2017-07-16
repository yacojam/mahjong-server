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
const actionNewGame = require('./actionNewGame')
const actionFilter = require('./actionFilter')

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

  if (action.type === 'ACTION_NEW_GAME') {
    room = await actionNewGame(action)
  }

  if (action.type === paiAction.ACTION_DINGQUE) {
    room = await actionDingQue(action)
  }

  if (action.type === paiAction.ACTION_CHU) {
    room = await actionChuPai(action)
  }

  if (
    action.type === paiAction.ACTION_GSHUA ||
    action.type === paiAction.ACTION_ZIMO
  ) {
    room = await actionHu(action)
  }

  if (action.type === paiAction.ACTION_WGANG) {
    room = await actionWanGang(action)
  }

  if (action.type === paiAction.ACTION_ANGANG) {
    room = await actionGang(action, true)
  }

  // other user chupai actions
  if (
    action.type === paiAction.ACTION_PENG ||
    action.type === paiAction.ACTION_PGANG ||
    action.type === paiAction.ACTION_PAOHU ||
    action.type === paiAction.ACTION_QGHU
  ) {
    room = await actionFilter(action)
  }

  return room
}

module.exports = {
  create,
  reducer
}

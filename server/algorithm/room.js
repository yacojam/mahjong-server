const Game = require('./mahjong')
const slice233 = require('./slice233')
const actionTypes = require('./actiontypes')
const userAction = require('./HxmjRules/hxaction')
const states = require('./states')
const User = require('./user')
const MAX_USER = 2 // just for test

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
    return handleUserJoinRoom(room, user)
  }

  if (action.type === actionTypes.ACTION_ROOM_USER_CHUPAI) {
    // check is valid
    if (
      !room.users.find(
        user =>
          user.actions.indexOf('chupai') !== -1 && user.uid === action._uid
      )
    ) {
      throw `user ${user.uid} cannot chupai`
    }
    const tile = action.tile
    // makeup each actions
    let hasChi = false
    let hasPeng = false
    let hasGang = false
    let hasHu = false
    room.users.forEach(user => {
      if (user.uid === action._uid) return
      user.actions = tileActions(user.tiles, tile)
      hasChi = hasChi || user.actions.indexOf('chi') !== -1
      hasPeng = hasPeng || user.actions.indexOf('peng') !== -1
      hasGang = hasGang || user.actions.indexOf('gang') !== -1
      hasHu = hasHu || user.actions.indexOf('hu') !== -1
    })

    // remove low priority action
    if (hasHu) {
    }
  }

  return room
}

async function handleUserJoinRoom(room, user) {
  if (room.users.findIndex(user => user.uid == action._uid) != -1) {
    throw 'user alreay in room'
  }
  if (room.users.length == MAX_USER) {
    throw 'room full'
  }

  room.users.push(user)
  console.log(`user ${user} join room ${room}`)
  if (
    room.users.length == MAX_USER
    // && room.users.every(user => user.state === states.STATE_USER_START) // todo
  ) {
    // start game
    const game = new Game()
    const tiles = game.getTiles()
    // deal
    room.users.forEach(user => {
      user.tiles = tiles.splice(0, 13) // each 13 cards
    })
    const dealer = room.users[0]
    dealer.tiles.push(tiles.pop()) // dealer has 14 cards, start
    dealer.actions = ['chupai']

    room.leftTiles = tiles
  }
}

module.exports = {
  create,
  reducer
}

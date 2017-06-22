const Game = require('./mahjong')
const actionTypes = require('./actiontypes')
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
    if (room.users.length == MAX_USER) {
      throw 'room full'
    }
    if (room.users.findIndex(user => user.uid == action._uid) != -1) {
      throw 'user alreay in room'
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
    }

    return room
  }

  return room
}

function tileActions(tiles, tile) {}

function canHu(tiles, tile) {}

function is332(tiles) {
  tiles.sort((a, b) => a - b)
  for (let i = 0; i != tiles.length; ++i) {
  }
}

function pick3(tiles, tile) {
  if (tiles.length == 0) {
    return 3
  }
  if (tiles.length == 2) {
    return 2
  }
  if (hasAAA(tiles, tile)) {
    const leftTiles = []
    let cnt = 0
    tiles.forEach(t => {
      if (t === tile && cnt != 3) {
        ++cnt
      } else {
        leftTiles.push(t)
      }
    })
    return leftTiles
  }
  if (hasABC(tiles, tile)) {
    const i1 = tiles.indexOf(tile)
    const i2 = tiles.indexOf(tile + 1)
    const i3 = tiles.indexOf(tile + 2)
    const leftTiles = []
    tiles.forEach((t, i) => {
      if (i != i1 && i != i2 && i != i3) {
        leftTiles.push(t)
      }
    })
    return leftTiles
  }
  return 0
}

function hasAAA(tiles, tile) {
  let cnt = 0
  tiles.forEach(t => {
    if (t === tile) {
      ++cnt
    }
  })
  return cnt >= 3
}

function hasABC(tiles, tile) {
  return tiles.indexOf(tile + 1) !== -1 && tiles.indexOf(tile + 2) !== -1
}

module.exports = {
  create,
  reducer
}

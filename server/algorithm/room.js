const Game = require('./mahjong')
const actionTypes = require('./actiontypes')
const states = require('./states')
const User = require('./user')
const MAX_USER = 2 // just for test

function create(id) {
  return {
    id,
    game: null,
    users: [],
    state: actionTypes.ROOM_STATE_INIT
  }
}

async function reducer(room, action) {
  // apply user reducer
  await Promise.all(room.users.map(user => User.reducer(user, action)))

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

    return room
  }

  return room
}

module.exports = {
  create,
  reducer
}

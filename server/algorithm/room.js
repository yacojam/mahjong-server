const Game = require('./mahjong')
const actionTypes = require('./actiontypes')

class Room {
  constructor(id) {
    this.id = id
    this.game = null
    this.users = []
    this.state = ROOM_STATE_INIT
  }

  userJoin(uid) {
    if (this.users.length == 4 || this.users.indexOf(uid)) {
      return false
    }
    this.users.push(uid)
    return true
  }

  start() {
    this.game = new Game()
  }
}

function reducer(room, action, cb) {
  if (action.type === actionTypes.ACTION_ROOM_USER_JOIN) {
    const uid = action.uid
    if (room.users.length == 4) {
      return cb('room full')
    }
    if (room.users.indexOf(uid) != -1) {
      return cb('user alreay in room')
    }
    room.users.push(uid)
    return cb(null, room)
  }

  if (action.type == actionTypes.ACTION_ROOM_USER_START) {
  }
}

const MAX_USER = 2 // just for test
async function userJoin(room, user) {
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

module.exports = userJoin

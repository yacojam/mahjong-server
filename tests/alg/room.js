const assert = require('assert')
const equal = assert.equal
const Room = require('../../server/algorithm/room')
const User = require('../../server/algorithm/user')
const actionTypes = require('../../server/algorithm/actiontypes')
const states = require('../../server/algorithm/states')

describe('Room', function() {
  const rid = 'A123'
  it('create', () => {
    const room = Room.create(rid)
    console.log(room)
    equal(room.id, rid)
  })

  it('user join', async () => {
    let room = Room.create(rid)
    room = await Room.reducer(room, {
      type: actionTypes.ACTION_ROOM_USER_JOIN,
      user: User.create('U123', 'max')
    })
    console.log(room)
  })
})

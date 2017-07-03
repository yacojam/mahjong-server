const assert = require('assert')
const equal = assert.equal
const store = require('../server/dataflow/store')
const redis = require('../server/redis')

describe('store', function() {
  it('set room', async () => {
    await store.setRoom('abc', { id: 'abc' })
    const room = await redis.get('ROOM_abc')
    console.log(room)
    equal(room.id, 'abc')
  })
})

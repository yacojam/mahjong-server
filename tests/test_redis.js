const redis = require('../server/redis')

redis.set('foo', { a: 1 })
/*
redis.get('foo', (error, result) => {
  console.log(result)
})
*/

async function test() {
  const result = await redis.get('foo')
  console.log(result)
}

test()

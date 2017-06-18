const Redis = require('ioredis')
const redis = new Redis()

redis.set('foo', 'bar2')
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

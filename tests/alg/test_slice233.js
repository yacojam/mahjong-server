const slice233 = require('../../server/algorithm/slice233')

function parse(input) {
  const tiles = []
  for (let i = 0; i != input.length; ++i) {
    tiles[i] = parseInt(input[i])
  }
  return tiles
}

describe('slice233', function() {
  it('', () => {
    const tiles = parse('11223344556677')
    const rets = slice233(tiles)
    console.log(rets)
  })
})

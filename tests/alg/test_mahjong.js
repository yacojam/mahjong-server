const assert = require('assert')
const Game = require('../../server/algorithm/mahjong')

const defultSize = 144
describe('Game', function() {
  it('tile num default', () => {
    const game = new Game()
    assert.equal(game.getTiles().length, defultSize)
  })
  it('tile num default', () => {
    const game = new Game({
      hasZi: false,
      hasHua: true,
      hasBaida: false
    })
    assert.equal(game.getTiles().length, 116)
  })

  it('game getTile', () => {
    const game = new Game()
    let tiles = game.getTiles()
    game.getTile()
    assert.equal(tiles.length, defultSize)
    tiles = game.getTiles()
    assert.equal(tiles.length, defultSize - 1)
  })
})

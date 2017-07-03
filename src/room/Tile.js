import React, { Component } from 'react'
import Action from '../hxaction'
// import Game from '../mahjong'

class Tile extends Component {
  chupai = () => {
    const { tile } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_CHU,
      pai: tile
    })
  }
  render() {
    const { tile, chupai } = this.props
    const style = {
      padding: 5
    }
    // const tileImg = Game.render(tile) + '(' + tile + ')'
    const tileImg = tile
    return (
      <button
        className="tile"
        style={style}
        onClick={this.chupai}
        disabled={chupai ? '' : 'disabled'}
      >
        {tileImg}
      </button>
    )
  }
}

export default Tile

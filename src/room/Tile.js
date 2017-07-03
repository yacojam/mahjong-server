import React, { Component } from 'react'
// import Game from '../mahjong'

class Tile extends Component {
  chupai = () => {
    const { tile } = this.props
    console.log('chupai', tile)
  }
  render() {
    const { tile, chupai } = this.props
    const style = {
      padding: 5
    }
    // const tileImg = Game.render(tile) + '(' + tile + ')'
    const tileImg = tile
    if (chupai) {
      return (
        <button className="tile" style={style} onClick={this.chupai}>
          {tileImg}
        </button>
      )
    } else {
      return <span className="tile" style={style}>{tileImg}</span>
    }
  }
}

export default Tile

import React, { Component } from 'react'
import Game from '../../server/algorithm/mahjong'

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
    const tileImg = Game.render(tile) + '(' + tile + ')'
    if (chupai) {
      return (
        <a className="tile" style={style} onClick={this.chupai} href="#">
          {tileImg}
        </a>
      )
    } else {
      return <span className="tile" style={style}>{tileImg}</span>
    }
  }
}

export default Tile

import React, { Component } from 'react'
import Tile from './Tile'

class Tiles extends Component {
  render() {
    const { chupai, tiles } = this.props
    return (
      <span>
        {tiles.map((tile, idx) => (
          <Tile key={idx} tile={tile} chupai={chupai} />
        ))}
      </span>
    )
  }
}

export default Tiles

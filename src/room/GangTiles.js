import React, { Component } from 'react'
import Tile from './Tile'

class GangTiles extends Component {
  render() {
    const { pai, angang } = this.props
    return (
      <div
        style={{
          width: 3 * (window.pWidth + 2),
          height: window.pHeight,
          position: 'relative',
          display: 'inline-block'
        }}
      >
        <Tile
          style={{
            width: window.pWidth,
            height: window.pHeight,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          tile={angang ? '' : pai}
        />
        <Tile
          style={{
            width: window.pWidth,
            height: window.pHeight,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            top: 0,
            left: window.pWidth + 2
          }}
          tile={angang ? '' : pai}
        />
        <Tile
          style={{
            width: window.pWidth,
            height: window.pHeight,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            top: 0,
            left: (window.pWidth + 2) * 2
          }}
          tile={angang ? '' : pai}
        />

        <Tile
          style={{
            width: window.pWidth,
            height: window.pHeight,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            transform: 'rotate(90deg)',
            top: 0,
            left: window.pWidth
          }}
          tile={pai}
        />
      </div>
    )
  }
}

export default GangTiles

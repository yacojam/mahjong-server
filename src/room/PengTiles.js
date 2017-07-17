import React, { Component } from 'react'
import Tile from './Tile'

class PengTiles extends Component {
  render() {
    const { pai } = this.props
    return (
      <div
        style={{
          width: 2 * window.pWidth,
          height: window.pHeight,
          position: 'relative'
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
          tile={pai}
        />
        <Tile
          style={{
            width: window.pWidth,
            height: window.pHeight,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            top: 0,
            left: window.pWidth - 2
          }}
          tile={pai}
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
            left: window.pWidth / 2
          }}
          tile={pai}
        />
      </div>
    )
  }
}

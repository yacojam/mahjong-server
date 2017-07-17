import React, { Component } from 'react'
import HeroUser from './room/HeroUser'

class Board extends Component {
  state = {
    width: 30,
    height: 40
  }
  constructor(context) {
    super(context)
    window.pWidth = this.state.width
    window.pHeight = this.state.height
  }
  componentDidMount = () => {
    this.resize()
    window.addEventListener('resize', e => {
      this.resize()
    })
  }
  resize = () => {
    console.log('resize')
    const totalWidth = window.innerWidth - 200
    const width = (window.pWidth = parseInt(totalWidth / 15, 10) - 4)
    const height = (window.pHeight = width * 3 / 2)
    this.setState({
      width,
      height
    })
  }
  renderPengs = i => {
    console.log('width', window.pWidth)
    return (
      <div
        style={{
          width: 2 * window.pWidth,
          height: window.pHeight,
          position: 'relative'
        }}
      >
        <button
          style={{
            width: this.state.width,
            height: this.state.height,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {i}
        </button>
        <button
          style={{
            width: this.state.width,
            height: this.state.height,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            top: 0,
            left: window.pWidth - 2
          }}
        >
          {i}
        </button>
        <button
          style={{
            width: this.state.width,
            height: this.state.height,
            margin: 1,
            border: '1px solid #ccc',
            position: 'absolute',
            transform: 'rotate(90deg)',
            top: 0,
            left: window.pWidth / 2
          }}
        >
          {i}
        </button>
      </div>
    )
  }
  renderCards = () => {
    return new Array(15).fill(0).map((_, i) => {
      return (
        <button
          style={{
            width: this.state.width,
            height: this.state.height,
            margin: 1,
            border: '1px solid #ccc'
          }}
          key={i}
        >
          {i}
        </button>
      )
    })
  }
  render() {
    const { room } = this.props
    return (
      <div className="App">
        <div id="left">
          {this.renderCards()}
          {this.renderPengs('x')}
        </div>
        <div id="middle">
          <div id="top">
            top
          </div>
          <div id="center">
            center
          </div>
          <div id="bottom">
            {room && room.users.length > 0
              ? <HeroUser user={room.users[0]} />
              : null}
          </div>
        </div>
        <div id="right">
          right
        </div>

      </div>
    )
  }
}

export default Board

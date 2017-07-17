import React, { Component } from 'react'
import HeroUser from './room/HeroUser'
import LeftUser from './room/LeftUser'

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
    if (!room) {
      return (
        <div>
          room not exists
        </div>
      )
    }
    const heroIndex = room.users.findIndex(u => u.uid === window.uid)
    const cnt = room.users.length
    const heroUser = room.users[heroIndex]
    const rightUser = room.users[(heroIndex + 1) % cnt]
    const topUser = room.users[(heroIndex + 2) % cnt]
    const leftUser = room.users[(heroIndex + 3) % cnt]
    return (
      <div className="App">
        <div id="left">
          <LeftUser user={leftUser} />
        </div>
        <div id="middle">
          <div id="top">
            <LeftUser user={topUser} />
          </div>
          <div id="center">
            left: {room.leftPais.length}
          </div>
          <div id="bottom">
            {room && room.users.length > 0
              ? <HeroUser user={heroUser} />
              : null}
          </div>
        </div>
        <div id="right">
          <LeftUser user={rightUser} />
        </div>

      </div>
    )
  }
}

export default Board

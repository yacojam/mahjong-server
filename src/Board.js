import React, { Component } from 'react'
import HeroUser from './room/HeroUser'
import LeftUser from './room/LeftUser'
import Winner from './room/Winner'

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
  onNewGameClick = () => {
    window.socket.emit('action', {
      type: 'ACTION_NEW_GAME'
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
    const topUser = room.players > 2 && room.users[(heroIndex + 2) % cnt]
    const leftUser = room.players > 3 && room.users[(heroIndex + 3) % cnt]
    return (
      <div className="App">
        <div id="left">
          {leftUser ? <LeftUser user={leftUser} /> : null}
        </div>
        <div id="middle">
          <div id="top">
            {topUser ? <LeftUser user={topUser} /> : null}
          </div>
          <div id="center">
            left: {room.leftPais && room.leftPais.length}
            {room.state === 'DONE'
              ? room.users.map(user => {
                  return user.score
                    ? <Winner key={user.uid} user={user} />
                    : null
                })
              : null}
            {room.state === 'DONE' && heroUser.state !== 'STATE_USER_START'
              ? <button
                  style={{ zoom: 1.5, background: 'lightgray' }}
                  onClick={this.onNewGameClick}
                >
                  new game
                </button>
              : null}
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

import React, { Component } from 'react'
import User from './User'

class Winner extends Component {
  onClick = () => {
    window.socket.emit('action', {
      type: 'ACTION_NEW_GAME'
    })
  }
  render() {
    const { name, score } = this.props.user
    return (
      <div>
        <h1>
          {name} win {score.join('/')}
          <button onClick={this.onClick}>new game</button>
        </h1>
      </div>
    )
  }
}

class Room extends Component {
  render() {
    const { room } = this.props
    const user = room.users.find(u => u.uid === window.uid)
    return (
      <div>
        <div>id: {room.id}</div>
        {room.state === 'DONE'
          ? room.users.map(user => {
              return user.score ? <Winner key={user.uid} user={user} /> : null
            })
          : null}
        <div>
          {room.users.map(user => <User user={user} key={user.uid} />)}
          {/*<User user={user} />*/}
        </div>
      </div>
    )
  }
}

export default Room

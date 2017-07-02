import React, { Component } from 'react'
import Tiles from './Tiles'
import User from './User'

class Room extends Component {
  render() {
    const { room } = this.props
    return (
      <div>
        <div>id: {room.id}</div>
        <div>
          {room.users.map(user => <User user={user} key={user.uid} />)}
        </div>
      </div>
    )
  }
}

export default Room

import React, { Component } from 'react'
import User from './User'

class Room extends Component {
  render() {
    const { room } = this.props
    const user = room.users.find(u => u.uid == window.uid)
    return (
      <div>
        <div>id: {room.id}</div>
        <div>
          {/* room.users.map(user => <User user={user} key={user.uid} />) */}
          <User user={user} />
        </div>
      </div>
    )
  }
}

export default Room

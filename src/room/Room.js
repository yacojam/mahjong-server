import React, { Component } from 'react'

class Room extends Component {
  render() {
    const { room } = this.props
    return (
      <div>
        <div>id: {room.id}</div>
        <div>
          {room.users.map(user => (
            <div key={user.uid}>
              {user.name}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Room

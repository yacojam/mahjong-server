import React, { Component } from 'react'
import Tiles from './Tiles'

class Room extends Component {
  render() {
    const { room } = this.props
    return (
      <div>
        <div>id: {room.id}</div>
        <div>
          {room.users.map(user => (
            <div key={user.uid}>
              <div>
                {user.name}
              </div>
              {user.shouPais
                ? <Tiles tiles={user.shouPais} actions={user.actions} />
                : null}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Room

import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class Rooms extends React.Component {
  joinRoom = roomid => {
    window.socket.emit('action', {
      roomid,
      type: 'ACTION_ROOM_USER_JOIN'
    })
  }
  render() {
    const rooms = this.props.rooms
    const style = {
      marginRight: 10,
      marginBottom: 10
    }

    return (
      <div>
        {rooms.map(room => (
          <RaisedButton
            style={style}
            key={room.id}
            label={'join: ' + room.id + ' (' + room.users.length + ' users)'}
            primary={true}
            onClick={this.joinRoom.bind(this, room.id)}
          />
        ))}
      </div>
    )
  }
}

export default Rooms

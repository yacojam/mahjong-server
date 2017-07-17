import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class AddRoom extends React.Component {
  onClick = () => {
    const players = window.prompt('players: 2-4')
    window.socket.emit('createroom', players, roomid => {
      this.props.onRoomCreate && this.props.onRoomCreate()
    })
  }
  render() {
    return (
      <div>
        <RaisedButton
          label="create room"
          primary={true}
          onClick={this.onClick}
        />
      </div>
    )
  }
}

export default AddRoom

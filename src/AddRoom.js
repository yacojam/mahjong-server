import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class AddRoom extends React.Component {
  onClick = () => {
    const players = parseInt(window.prompt('players: 2-4'), 10)
    if (!players || players < 2 || players > 4) {
      alert('2-4 plz')
      return
    }
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

import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class AddRoom extends React.Component {
  onClick = () => {
    window.socket.emit('createroom', roomid => {
      this.props.onRoomCreate && this.props.onRoomCreate(roomid)
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

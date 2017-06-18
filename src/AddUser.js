import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { createForm } from 'rc-form'

class AddUser extends React.Component {
  state = {
    rooms: [],
    roomid: null,
    uid: 'User' + new Date().getTime()
  }
  onAddUserClick = () => {
    if (!this.state.roomid) {
      alert('create room plz')
      return
    }
    this.props.form.validateFields((error, values) => {
      if (error) {
        alert('uid & name required')
        return
      }
      const user = { uid: values.uid, name: values.name }
      window.socket.emit('userjoin', user, user => {
        window.socket.emit('action', {
          roomid: this.state.roomid,
          type: 'ACTION_ROOM_USER_JOIN',
          user
        })
      })
    })
  }
  componentDidMount = () => {
    fetch('/rooms').then(rsp => rsp.json()).then(ret => {
      console.log(ret)
      if (ret.code !== 0) {
        alert(ret.message)
        return
      }
      this.setState({
        rooms: ret.data || []
      })
    })
  }
  onRoomChange = (evt, idx, roomid) => {
    this.setState({ roomid })
  }
  render() {
    const { getFieldProps } = this.props.form
    return (
      <div>
        <TextField
          {...getFieldProps('uid', {
            rules: [{ required: true }],
            initialValue: this.state.uid
          })}
          style={{ marginRight: 10 }}
          hintText="uid"
          floatingLabelText="uid"
        />
        <TextField
          {...getFieldProps('name', {
            rules: [{ required: true }],
            initialValue: 'max',
            onChange() {
              console.log(arguments)
            }
          })}
          style={{ marginRight: 10 }}
          hintText="name"
          floatingLabelText="name"
        />
        <SelectField
          floatingLabelText="room"
          value={this.state.roomid}
          onChange={this.onRoomChange}
        >
          {this.state.rooms.map(roomid => (
            <MenuItem value={roomid} primaryText={roomid} key={roomid} />
          ))}
        </SelectField>
        <RaisedButton
          label="Add user"
          primary={true}
          onClick={this.onAddUserClick}
        />
      </div>
    )
  }
}

export default createForm()(AddUser)

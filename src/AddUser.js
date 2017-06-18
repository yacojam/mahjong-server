import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { createForm } from 'rc-form'

class AddUser extends React.Component {
  onAddUserClick = () => {
    if (!this.props.roomid) {
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
        window.socket.emit('data', {
          action: {
            roomid: this.props.roomid,
            type: 'ACTION_ROOM_USER_JOIN',
            user
          }
        })
      })
    })
  }
  render() {
    const { getFieldProps } = this.props.form
    return (
      <div>
        <TextField
          {...getFieldProps('uid', {
            rules: [{ required: true }],
            initialValue: 'user' + new Date().getTime()
          })}
          style={{ marginRight: 10 }}
          hintText="uid"
          floatingLabelText="uid"
        />
        <TextField
          {...getFieldProps('name', {
            rules: [{ required: true }],
            initialValue: 'max'
          })}
          style={{ marginRight: 10 }}
          hintText="name"
          floatingLabelText="name"
        />
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

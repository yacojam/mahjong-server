import React, { Component } from 'react'
import './App.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Box, { VBox } from 'react-layout-components'
import AddRoom from './AddRoom'
import Rooms from './Rooms'
import Messages from './Messages'
import Room from './room/Room'
import Board from './Board'

injectTapEventPlugin()
class App extends Component {
  constructor(context) {
    super(context)
    this.state = {
      room: null,
      rooms: [],
      messages: []
    }
  }
  onRoomCreate = roomid => {
    this.refreshRooms()
  }
  refreshRooms = () => {
    fetch('/rooms').then(rsp => rsp.json()).then(ret => {
      console.log(ret)
      if (ret.code !== 0) {
        alert(ret.message)
        return
      }
      const room = ret.data.find(room => {
        return !room.users.every(user => user.uid !== window.uid)
      })
      this.setState({
        room,
        rooms: ret.data || []
      })
    })
  }
  onLogoutClick = () => {
    fetch('/logout', {
      credentials: 'same-origin'
    })
      .then(rsp => rsp.json())
      .then(ret => {
        if (ret.code === 0) {
          window.location.reload()
        }
      })
  }
  componentDidMount = () => {
    this.refreshRooms()

    window.socket.on('data', data => {
      const messages = this.state.messages
      messages.push({
        date: new Date(),
        type: 1,
        data
      })
      this.setState({ messages })

      if (!data.error && data.data) {
        this.setState({ room: data.data })
      }
    })
  }
  render() {
    return <Board room={this.state.room} />
    return (
      <MuiThemeProvider>
        <VBox>
          <Box>
            <button onClick={this.onLogoutClick} style={{ fontSize: '120%' }}>
              logout: {window.uid}
            </button>
          </Box>
          <VBox>
            {this.state.room
              ? <Room room={this.state.room} />
              : <Rooms rooms={this.state.rooms} />}
            <hr />
            {this.state.room
              ? 'left room'
              : <AddRoom onRoomCreate={this.onRoomCreate} />}
          </VBox>
          <Box>
            <Messages messages={this.state.messages} />
          </Box>

        </VBox>
      </MuiThemeProvider>
    )
  }
}

export default App

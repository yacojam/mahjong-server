import React, { Component } from 'react'
import './App.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Box, { VBox } from 'react-layout-components'
import AddRoom from './AddRoom'
import Rooms from './Rooms'
import Messages from './Messages'

injectTapEventPlugin()
class App extends Component {
  constructor(context) {
    super(context)
    this.state = {
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
      this.setState({
        rooms: ret.data || []
      })
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
    })
  }
  render() {
    return (
      <MuiThemeProvider>
        <Box>
          <Box width={240}>
            <Messages messages={this.state.messages} />
          </Box>
          <VBox flex={1}>
            <Rooms rooms={this.state.rooms} />
            <hr />
            <AddRoom onRoomCreate={this.onRoomCreate} />
          </VBox>
        </Box>
      </MuiThemeProvider>
    )
  }
}

export default App

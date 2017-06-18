import React, { Component } from 'react'
import './App.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Box, { VBox } from 'react-layout-components'
import AddUser from './AddUser'
import AddRoom from './AddRoom'

injectTapEventPlugin()
class App extends Component {
  constructor(context) {
    super(context)
    this.state = { roomid: 0 }
  }
  onRoomCreate = roomid => {
    this.setState({ roomid })
  }
  render() {
    return (
      <MuiThemeProvider>
        <VBox style={{ padding: 20 }}>
          <Box height={500}>
            {this.state.roomid
              ? 'game: ' + this.state.roomid
              : 'NOT ROOM, CREATE ONE PLZ'}
          </Box>
          <hr />
          <AddRoom onRoomCreate={this.onRoomCreate} />
          <AddUser />
        </VBox>
      </MuiThemeProvider>
    )
  }
}

export default App

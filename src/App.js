import React, { Component } from 'react'
import './App.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Box, { VBox } from 'react-layout-components'
import AddRoom from './AddRoom'

import RaisedButton from 'material-ui/RaisedButton'
injectTapEventPlugin()
class App extends Component {
  constructor(context) {
    super(context)
    this.state = { rooms: [] }
  }
  onRoomCreate = roomid => {
    this.setState({ roomid })
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
  render() {
    const style = {
      marginRight: 10
    }
    return (
      <MuiThemeProvider>
        <VBox style={{ padding: 20 }}>
          {this.state.rooms.map(room => (
            <RaisedButton
              style={style}
              key={room}
              label={'join: ' + room}
              primary={true}
            />
          ))}
          <hr />
          <AddRoom onRoomCreate={this.onRoomCreate} />
        </VBox>
      </MuiThemeProvider>
    )
  }
}

export default App

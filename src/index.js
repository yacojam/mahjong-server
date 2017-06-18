import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import io from 'socket.io-client'

const socket = new io(':8080')
socket.on('data', data => {
  console.log(data)
})
window.socket = socket

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

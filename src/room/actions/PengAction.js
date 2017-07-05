import React, { Component } from 'react'

class PengAction extends Component {
  render() {
    const { pai } = this.props
    return (
      <button>
        peng:{pai}
      </button>
    )
  }
}

export default PengAction

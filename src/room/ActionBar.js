import React, { Component } from 'react'
import Tiles from './Tiles'
import Action from '../hxaction'
import DingQueAction from './actions/DingQueAction'
import PaiAction from './actions/PaiAction'

class ActionBar extends Component {
  renderAction = (action, pai) => {
    if (action === Action.ACTION_DINGQUE) {
      return <DingQueAction key="dingque" />
    }
    if (action === Action.ACTION_PENG) {
      return <PaiAction type={action} pai={pai} name="peng" key="peng" />
    }
    if (action === Action.ACTION_PAOHU || action === Action.ACTION_ZIMO) {
      return <PaiAction type={action} pai={pai} name="hu" key="hu" />
    }
    if (action === Action.ACTION_WGANG) {
      return <PaiAction type={action} pai={pai} name="wangang" key="wangang" />
    }
    if (action === Action.ACTION_PGANG) {
      return <PaiAction type={action} pai={pai} name="pgang" key="pgang" />
    }
    if (action === Action.ACTION_ANGANG) {
      return <PaiAction type={action} pai={pai} name="angang" key="angang" />
    }
    if (action === Action.ACTION_CANCEL) {
      return <PaiAction type={action} pai={pai} name="cancel" key="cancel" />
    }

    if (action === Action.ACTION_GSHUA) {
      return (
        <PaiAction
          type={action}
          pai={pai}
          name="gangshanghua"
          key="gangshanghua"
        />
      )
    }
  }
  render() {
    const { actions } = this.props
    return (
      <div>
        {actions.map(a => this.renderAction(a.pAction, a.pai))}
      </div>
    )
  }
}

export default ActionBar

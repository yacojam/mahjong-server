import React, { Component } from 'react'
import Tiles from './Tiles'
import Action from '../hxaction'
import DingQueAction from './actions/DingQueAction'
import PaiAction from './actions/PaiAction'

class User extends Component {
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
  renderActions = actions => {
    const hasCancel =
      actions.length > 0 &&
      actions[0].pAction !== Action.ACTION_CHU &&
      actions[0].pAction !== Action.ACTION_DINGQUE
    return (
      <div>
        {actions.map(a => this.renderAction(a.pAction, a.pai))}
        {hasCancel
          ? <PaiAction type={Action.ACTION_CANCEL} pai="-" name="cancel" />
          : null}
      </div>
    )
  }
  render() {
    const { user } = this.props
    const isSelf = user.uid === window.uid
    const actions = user.actions
    const chupai =
      actions.findIndex(action => action.pAction === Action.ACTION_CHU) !== -1

    const style = isSelf
      ? {
          color: 'green'
        }
      : {
          color: '#666'
        }

    return (
      <div style={style}>
        <div>
          {isSelf ? <b>{user.name}</b> : user.name}
        </div>
        <div style={{ padding: 2 }}>
          chupai: <Tiles tiles={user.chuPais} chupai={false} />
          <br />
          peng: <Tiles tiles={user.pengPais} chupai={false} />
          gang: <Tiles tiles={user.gangPais} chupai={false} />
          angang: <Tiles tiles={user.anGangPais} chupai={false} />
          que: {user.que}
        </div>
        <div>
          {user.shouPais
            ? <Tiles tiles={user.shouPais} chupai={isSelf && chupai} />
            : null}
        </div>
        <div className="userActions">
          {isSelf ? this.renderActions(actions) : ''}
        </div>
      </div>
    )
  }
}

export default User

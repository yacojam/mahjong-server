import React, { Component } from 'react'
import Tiles from './Tiles'
import PengTiles from './PengTiles'
import ActionBar from './ActionBar'
import Action from '../hxaction'

class HeroUser extends Component {
  render() {
    const { user } = this.props
    const chupai =
      user.actions.findIndex(a => a.pAction === Action.ACTION_CHU) != -1
    return (
      <div>
        <div className="hero-chupais" style={{ height: window.pHeight + 5 }}>
          <Tiles tiles={user.chuPais} chupai={false} />
        </div>
        <div className="hero-shoupais">
          {user.pengPais.map(pai => <PengTiles key={pai} pai={pai} />)}
          <Tiles tiles={user.shouPais} chupai={chupai} />
        </div>
        <div className="hero-actions">
          <ActionBar actions={user.actions} />
        </div>
      </div>
    )
  }
}

export default HeroUser

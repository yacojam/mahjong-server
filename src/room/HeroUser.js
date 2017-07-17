import React, { Component } from 'react'
import Tiles from './Tiles'
import PengTiles from './PengTiles'

class HeroUser extends Component {
  render() {
    const { user } = this.props
    return (
      <div>
        <div className="hero-chupais" style={{ height: window.pHeight + 5 }}>
          <Tiles tiles={user.chuPais} chupai={false} />
        </div>
        <div className="hero-shoupais">
          {user.pengPais.map(pai => <PengTiles key={pai} pai={pai} />)}
          <Tiles tiles={user.shouPais} />
        </div>
      </div>
    )
  }
}

export default HeroUser

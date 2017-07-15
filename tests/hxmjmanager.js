const assert = require('assert')
const HXMJManager = require('../server/algorithm/HxmjRules/HxmjManager')
const Action = require('../server/algorithm/HxmjRules/hxaction')
const equal = assert.equal

describe('HXMJManager', function() {
  it('pao hu', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 27, 29]
    const pengPais = []
    const desPai = 29
    const que = 3
    const action = Action.ACTION_CHU
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 1)
    equal(actions[0].pAction, Action.ACTION_PAOHU)
  })

  it('zimo', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 27, 29]
    const pengPais = []
    const desPai = 29
    const que = 3
    const action = Action.ACTION_MO
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 1)
    equal(actions[0].pAction, Action.ACTION_ZIMO)
  })

  it('peng', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 19, 19]
    const pengPais = []
    const desPai = 19
    const que = 3
    const action = Action.ACTION_CHU
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 1)
    equal(actions[0].pAction, Action.ACTION_PENG)
  })

  it('qiang gang hu', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 29, 29]
    const pengPais = []
    const desPai = 27
    const que = 3
    const action = Action.ACTION_WGANG
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 1)
    equal(actions[0].pAction, Action.ACTION_QGHU)
  })
  it('qiang gang hu invalid', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 27, 29, 29]
    const pengPais = []
    const desPai = 0
    const que = 3
    const action = Action.ACTION_WGANG
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 0)
  })
  it('can not hu with que peng', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 29]
    const pengPais = [31]
    const desPai = 29
    const que = 3
    const action = Action.ACTION_CHU
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 0)
  })
  // 是否允许碰缺的牌？
  it('can peng que?', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 39, 39]
    const pengPais = []
    const desPai = 39
    const que = 3
    const action = Action.ACTION_CHU
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 1)
    equal(actions[0].pAction, Action.ACTION_PENG)
  })
  it('peng & hu', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25, 26, 27, 27]
    const pengPais = []
    const desPai = 27
    const que = 3
    const action = Action.ACTION_CHU
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 2)
    actions.sort((a, b) => a.pAction - b.pAction)
    equal(actions[0].pAction, Action.ACTION_PENG)
    equal(actions[1].pAction, Action.ACTION_PAOHU)
  })
  it('gang shang hua', () => {
    const shouPais = [11, 12, 13, 15, 16, 17, 21, 22, 23, 25]
    const pengPais = []
    const desPai = 25
    const que = 3
    const action = Action.ACTION_GMO
    const actions = HXMJManager.getActions(
      shouPais,
      pengPais,
      action,
      desPai,
      que
    )
    equal(actions.length, 1)
    equal(actions[0].pAction, Action.ACTION_GSHUA)
  })
})

import { getInitParamsNumber } from './../Base/StateMachine'
import StateMachine from '../Base/StateMachine'
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine'
import { SPIKES_MAX_STEP, SPIKES_PARAMS_ENUM, SPIKES_TYPE, SPIKES_TYPE_ORDER_ENUM } from '../Enum'
import SpikesTwoSubStateMachine from './SpikesTwoSubStateMachine'
import SpikesThreeSubStateMachine from './SpikeThreeStateMachine'
import SpikesFourSubStateMachine from './SpikeFourStateMachine'
import { Animation } from 'cc'

export default class SpikesStateMachine extends StateMachine {
  async init() {
    this.initParams()
    this.initStateMachine()
    this.initParamsEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(SPIKES_PARAMS_ENUM.SPIKES_TYPE, getInitParamsNumber())
    this.params.set(SPIKES_PARAMS_ENUM.SPIKES_STEP, getInitParamsNumber())
  }

  initStateMachine() {
    this.stateMachines.set(SPIKES_TYPE.SPIKES_ONE, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(SPIKES_TYPE.SPIKES_TWO, new SpikesTwoSubStateMachine(this))
    this.stateMachines.set(SPIKES_TYPE.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
    this.stateMachines.set(SPIKES_TYPE.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
  }

  run() {
    let type = this.params.get(SPIKES_PARAMS_ENUM.SPIKES_TYPE).value

    switch (this.currentState) {
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_ONE):
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_TWO):
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_THREE):
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_FOUR):
        if (type === SPIKES_TYPE_ORDER_ENUM[SPIKES_TYPE.SPIKES_ONE]) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_ONE)
        } else if (type === SPIKES_TYPE_ORDER_ENUM[SPIKES_TYPE.SPIKES_TWO]) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_TWO)
        } else if (type === SPIKES_TYPE_ORDER_ENUM[SPIKES_TYPE.SPIKES_THREE]) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_THREE)
        } else if (type === SPIKES_TYPE_ORDER_ENUM[SPIKES_TYPE.SPIKES_FOUR]) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_FOUR)
        } else {
          this.currentState = this.currentState
        }
        break

      default:
        this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_ONE)
    }
  }
}

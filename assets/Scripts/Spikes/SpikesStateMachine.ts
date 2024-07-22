import { getInitParamsNumber, getInitParamsTrigger } from './../Base/StateMachine'
import StateMachine from '../Base/StateMachine'
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine'
import { SPIKES_PARAMS_ENUM, SPIKES_TYPE } from '../Enum'

export default class SpikesStateMachine extends StateMachine {
  async init() {
    this.initParams()
    this.initStateMachine()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(SPIKES_PARAMS_ENUM.SPIKES_TYPE, getInitParamsNumber())
    this.params.set(SPIKES_PARAMS_ENUM.SPIKES_STEP, getInitParamsNumber())
  }

  initStateMachine() {
    this.stateMachines.set(SPIKES_TYPE.SPIKES_ONE, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(SPIKES_TYPE.SPIKES_TWO, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(SPIKES_TYPE.SPIKES_THREE, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(SPIKES_TYPE.SPIKES_FOUR, new SpikesOneSubStateMachine(this))
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_ONE):
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_TWO):
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_THREE):
      case this.stateMachines.get(SPIKES_TYPE.SPIKES_FOUR):
        if (this.params.get(SPIKES_PARAMS_ENUM.SPIKES_TYPE).value === 1) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_ONE)
        } else if (this.params.get(SPIKES_PARAMS_ENUM.SPIKES_TYPE).value === 2) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_TWO)
        } else if (this.params.get(SPIKES_PARAMS_ENUM.SPIKES_TYPE).value === 3) {
          this.currentState = this.stateMachines.get(SPIKES_TYPE.SPIKES_THREE)
        } else if (this.params.get(SPIKES_PARAMS_ENUM.SPIKES_TYPE).value === 4) {
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

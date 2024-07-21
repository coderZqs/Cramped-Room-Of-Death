import { Animation, AnimationClip } from 'cc'
import State from '../Base/State'
import StateMachine, { getInitParamsTrigger } from '../Base/StateMachine'
import { PARAMS_NAME_ENUM } from '../Enum'

class BurstStateMachine extends StateMachine {
  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
  }

  initStateMachine() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, '/texture/burst/idle', AnimationClip.WrapMode.Normal))
    this.stateMachines.set(
      PARAMS_NAME_ENUM.ATTACK,
      new State(this, '/texture/burst/attack', AnimationClip.WrapMode.Normal),
    )
    this.stateMachines.set(
      PARAMS_NAME_ENUM.DEATH,
      new State(this, '/texture/burst/death', AnimationClip.WrapMode.Normal),
    )
  }

  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    await Promise.all(this.waitingList)
  }

  run() {
    switch (this._currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else {
          this.currentState = this.currentState
        }

        break

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

export default BurstStateMachine

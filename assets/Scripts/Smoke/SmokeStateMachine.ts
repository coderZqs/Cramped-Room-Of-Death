import { Animation } from 'cc'
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../Base/StateMachine'
import { PARAMS_NAME_ENUM } from '../Enum'
import IdleSubStateMachine from './IdleSubStateMachine'
import DeathSubStateMachine from './DeathSubStateMachine'

class SmokeStateMachine extends StateMachine {
  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
  }

  initStateMachine() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
  }

  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initParamsEvent()
    await Promise.all(this.waitingList)
  }

  initParamsEvent(): void {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      if (this.animationComponent.defaultClip.name.includes('idle')) {
        this.setParams(PARAMS_NAME_ENUM.DEATH, true)
      }
    })
  }

  run() {
    switch (this._currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else {
          this.currentState = this.currentState
        }

        break

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

export default SmokeStateMachine

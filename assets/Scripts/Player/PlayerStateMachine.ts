import State from '../Base/State'
import StateMachine, { getInitParamsNumber, getInitPramsTrigger } from '../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { Animation, AnimationClip, Component, SpriteFrame } from 'cc'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRIghtSubStateMachine from './TurnRightSubStateMachine'

type ParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initParamsEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitPramsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, getInitPramsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_RIGHT, getInitPramsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  async initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnRIghtSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnLeftSubStateMachine(this))
  }

  run() {
    switch (this._currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT):
        if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT)
        }

        break

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

export default PlayerStateMachine

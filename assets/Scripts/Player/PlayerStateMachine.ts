import State from '../Base/State'
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../Base/StateMachine'
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { Animation } from 'cc'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRIghtSubStateMachine from './TurnRightSubStateMachine'
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine'
import BlockUpSubStateMachine from './BlockUpSubStateMachine'
import BlockBottomSubStateMachine from './BlockBottomSubStateMachine'
import BlockRightSubStateMachine from './BlockRightSubStateMachine'
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine'
import BlockTurnRightSubStateMachine from './BlockTurnLeftSubStateMachine'

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
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_UP, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_BOTTOM, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, getInitParamsTrigger())
  }

  async initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnRIghtSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_LEFT, new BlockLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_UP, new BlockUpSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_BOTTOM, new BlockBottomSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, new BlockRightSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, new BlockTurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, new BlockTurnRightSubStateMachine(this))
  }

  run() {
    switch (this._currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_UP):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_BOTTOM):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT):
        if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_UP).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_UP)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_BOTTOM).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_BOTTOM)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_RIGHT)
        } else {
          this.currentState = this.currentState
        }

        break

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

export default PlayerStateMachine

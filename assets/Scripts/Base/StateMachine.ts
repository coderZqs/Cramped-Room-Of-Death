import State from './State'
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { Animation, AnimationClip, Component, SpriteFrame } from 'cc'

type ParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

const initParamsInitTrigger = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

class StateMachine extends Component {
  private _currentState: State
  private params: Map<string, IParamsValue> = new Map()
  private stateMachines: Map<string, State> = new Map()
  public animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []

  get currentState() {
    return this.currentState
  }

  set currentState(state: State) {
    this._currentState = state
    this._currentState.run()
  }

  getParams(paramsName) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName)
    }
  }

  setParams(paramsName, paramsValue: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = paramsValue
      this.run()
    }
  }

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, initParamsInitTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, initParamsInitTrigger())
  }

  async initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top'))
    this.stateMachines.set(
      PARAMS_NAME_ENUM.TURN_LEFT,
      new State(this, 'texture/player/turnleft/top', AnimationClip.WrapMode.Normal),
    )
  }

  run() {
    switch (this._currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
        if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }

        break

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

export default StateMachine

import State from './State'
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { Animation, AnimationClip, Component, SpriteFrame } from 'cc'

type ParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

export const getInitPramsTrigger = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

export const getInitParamsNumber = () => {
  return {
    type: FSM_PARAM_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

abstract class StateMachine extends Component {
  public _currentState: State
  public params: Map<string, IParamsValue> = new Map()
  public stateMachines: Map<string, State> = new Map()
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
      this.resetTrigger()
    }
  }

  resetTrigger() {
    for (let [_, value] of this.params) {
      if (value.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }
  }

  initParamsEvent() {
    this.animationComponent.on(
      Animation.EventType.FINISHED,
      () => {
        let name = this.animationComponent.defaultClip.name
        let whiteList = ['turn']

        if (whiteList.some(v => name.includes(v))) {
          this.setParams(PARAMS_NAME_ENUM.IDLE, true)
        }
      },
      this,
    )
  }

  abstract init()
  abstract run(): void
}

export default StateMachine

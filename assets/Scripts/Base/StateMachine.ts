import State from './State'
import { CONTROLLER_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import { Animation, AnimationClip, Component, SpriteFrame } from 'cc'
import SubStateMachine from './SubStateMachine'

type ParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

export const getInitParamsTrigger = () => {
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
  public _currentState: State | SubStateMachine
  public params: Map<string, IParamsValue> = new Map()
  public stateMachines: Map<string, State | SubStateMachine> = new Map()
  public animationComponent: Animation

  waitingList: Array<Promise<SpriteFrame[]>> = []

  get currentState() {
    return this.currentState
  }

  set currentState(state: State | SubStateMachine) {
    this._currentState = state
    this._currentState.run()
  }

  getParams(paramsName) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName)
    }
  }

  setParams(paramsName, paramsValue: ParamsValueType) {
    console.log(paramsName, paramsValue)
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
        console.log(name)
        let whiteList = ['turn', 'block']

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

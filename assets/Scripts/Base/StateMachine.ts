import State from './State'
import { FSM_PARAM_TYPE_ENUM } from '../Enum'

export interface IParamsValue {
  type: FSM_PARAM_TYPE_ENUM
  value: ParamsValueType
}

type ParamsValueType = boolean | number

class StateMachine {
  private _currentState: State
  private params: Map<string, IParamsValue> = new Map()
}

import { PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM } from '../Enum'
import SubStateMachine from './SubStateMachine'

abstract class DirectionSubStateMachine extends SubStateMachine {
  constructor(fsm) {
    super(fsm)
  }

  run() {
    const { value: newDirection } = this.fsm.params.get(PARAMS_NAME_ENUM.DIRECTION)
    console.log(newDirection)
    this.currentState = this.stateMachine.get(DIRECTION_ORDER_ENUM[newDirection as number])
  }
}

export default DirectionSubStateMachine

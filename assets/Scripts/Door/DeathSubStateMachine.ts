import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../Base/DirectionSubStateMachine'
import State from '../Base/State'
import StateMachine from '../Base/StateMachine'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enum'
import SubStateMachine from '../Base/SubStateMachine'

let BASE_URL = 'texture/door/death/'

class DeathSubStateManager extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    this.stateMachine.set(DIRECTION_ENUM.UP, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.LEFT, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.RIGHT, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.BOTTOM, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
  }
}

export default DeathSubStateManager

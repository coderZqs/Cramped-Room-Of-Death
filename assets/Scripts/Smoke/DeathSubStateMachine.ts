import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../Base/DirectionSubStateMachine'
import State from '../Base/State'
import StateMachine from '../Base/StateMachine'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enum'

let BASE_URL = 'texture/door/death/'

class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    this.stateMachine.set(DIRECTION_ENUM.UP, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.LEFT, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.RIGHT, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.BOTTOM, new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
  }
}

export default DeathSubStateMachine

import { AnimationClip } from 'cc'
import DirectionSubStateMachine from '../Base/DirectionSubStateMachine'
import State from '../Base/State'
import StateMachine from '../Base/StateMachine'
import { DIRECTION_ENUM } from '../Enum'

let BASE_URL = 'texture/ironskeleton/death/'

class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    this.stateMachine.set(DIRECTION_ENUM.LEFT, new State(fsm, BASE_URL + 'left', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.UP, new State(fsm, BASE_URL + 'top', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.BOTTOM, new State(fsm, BASE_URL + 'bottom', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(DIRECTION_ENUM.RIGHT, new State(fsm, BASE_URL + 'right', AnimationClip.WrapMode.Normal))
  }
}

export default DeathSubStateMachine

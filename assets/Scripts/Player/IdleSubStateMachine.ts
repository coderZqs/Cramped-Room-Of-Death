import { AnimationClip } from 'cc'
import State from '../Base/State'
import StateMachine from '../Base/StateMachine'
import { CONTROLLER_ENUM } from '../Enum'
import DirectionSubStateMachine from '../Base/DirectionSubStateMachine'

const BASE_URL = 'texture/player/idle/'

class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)

    this.stateMachine.set(CONTROLLER_ENUM.LEFT, new State(fsm, BASE_URL + 'left', AnimationClip.WrapMode.Loop))
    this.stateMachine.set(CONTROLLER_ENUM.UP, new State(fsm, BASE_URL + 'top', AnimationClip.WrapMode.Loop))
    this.stateMachine.set(CONTROLLER_ENUM.RIGHT, new State(fsm, BASE_URL + 'right', AnimationClip.WrapMode.Loop))
    this.stateMachine.set(CONTROLLER_ENUM.BOTTOM, new State(fsm, BASE_URL + 'bottom', AnimationClip.WrapMode.Loop))
  }
}

export default IdleSubStateMachine

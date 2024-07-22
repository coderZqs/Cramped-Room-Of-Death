import { AnimationClip } from 'cc'
import State from '../Base/State'
import SubStateMachine from '../Base/SubStateMachine'
import { SPIKES_PARAMS_ENUM } from '../Enum'
import { SPIKES_SUBSTATE_TYPE, SPIKES_SUBSTATE_ORDER_ENUM } from '../Enum'

const BASE_URL = '/texture/spikes/spikestwo/'

export default class SpikesOneSubStateMachine extends SubStateMachine {
  constructor(fsm) {
    super(fsm)

    this.stateMachine.set(SPIKES_SUBSTATE_TYPE.ZERO, new State(fsm, BASE_URL + 'zero', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(SPIKES_SUBSTATE_TYPE.ONE, new State(fsm, BASE_URL + 'one', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(SPIKES_SUBSTATE_TYPE.TWO, new State(fsm, BASE_URL + 'two', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(SPIKES_SUBSTATE_TYPE.THREE, new State(fsm, BASE_URL + 'three', AnimationClip.WrapMode.Normal))
    this.stateMachine.set(SPIKES_SUBSTATE_TYPE.FOUR, new State(fsm, BASE_URL + 'four', AnimationClip.WrapMode.Normal))
  }

  run() {
    let { value: step } = this.fsm.params.get(SPIKES_PARAMS_ENUM.SPIKES_STEP)
    this.currentState = this.stateMachine.get(SPIKES_SUBSTATE_ORDER_ENUM[step as number])
  }
}

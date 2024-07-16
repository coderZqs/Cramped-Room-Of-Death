import SingleTon from './SingleTon'
import State from './State'
import StateMachine from './StateMachine'

abstract class SubStateMachine {
  stateMachine: Map<string, State> = new Map()
  _currentState: State

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState
  }

  set currentState(state: State) {
    console.log(state)
    this._currentState = state
    this.currentState.run()
  }

  abstract run(): void
}

export default SubStateMachine

import { Sprite, Component, UITransform, Animation, AnimationClip } from 'cc'
import SpikesStateMachine from './SpikesStateMachine'
import { TILE_WIDTH, TILE_HEIGHT } from '../Enum/level'
import { SPIKES_PARAMS_ENUM, SPIKES_SUBSTATE_ORDER_ENUM, SPIKES_SUBSTATE_TYPE, SPIKES_TYPE } from '../Enum'

export default class SpikesManager extends Component {
  public fsm: SpikesStateMachine = null
  public _state = null
  public _type: SPIKES_TYPE
  public _step: SPIKES_SUBSTATE_TYPE

  get type() {
    return this._type
  }

  set type(newType) {
    this._type = newType
    this.fsm.setParams(SPIKES_PARAMS_ENUM.SPIKES_TYPE, newType)
  }

  get step() {
    return this._step
  }

  set step(newStep) {
    this._step = newStep
    this.fsm.setParams(SPIKES_PARAMS_ENUM.SPIKES_STEP, SPIKES_SUBSTATE_ORDER_ENUM[newStep])
  }

  async start() {
    this.fsm = this.addComponent(SpikesStateMachine)
    this.fsm.animationComponent = this.addComponent(Animation)
    await this.fsm.init()

    let sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    let uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.type = SPIKES_TYPE.SPIKES_ONE
    this.step = SPIKES_SUBSTATE_TYPE.ZERO

    this.setAnimation()
  }

  setAnimation() {
    this.fsm.animationComponent.on(Animation.EventType.FINISHED, () => {
      console.log(this.fsm.animationComponent.defaultClip.name)
      if (this.fsm.animationComponent.defaultClip.name.includes('zero')) {
        this.step = SPIKES_SUBSTATE_TYPE.ONE
      } else if (this.fsm.animationComponent.defaultClip.name.includes('one')) {
        this.step = SPIKES_SUBSTATE_TYPE.TWO
      } else if (this.fsm.animationComponent.defaultClip.name.includes('two')) {
        this.step = SPIKES_SUBSTATE_TYPE.THREE
      } else {
        this.step = SPIKES_SUBSTATE_TYPE.ONE
      }
    })
  }
}

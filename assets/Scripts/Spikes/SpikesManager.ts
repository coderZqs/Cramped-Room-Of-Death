import { Sprite, Component, UITransform, Animation } from 'cc'
import SpikesStateMachine from './SpikesStateMachine'
import { TILE_WIDTH, TILE_HEIGHT } from '../Enum/level'
import { SPIKES_MAX_STEP, SPIKES_PARAMS_ENUM, SPIKES_TYPE, SPIKES_TYPE_ORDER_ENUM } from '../Enum'
import EntityManager from '../Base/EntityManager'

export default class SpikesManager extends Component {
  public fsm: SpikesStateMachine = null
  public _state = null
  public _type: SPIKES_TYPE
  public _step: number
  public x: number
  public y: number

  get type() {
    return this._type
  }

  set type(newType) {
    this._type = newType

    console.log(SPIKES_TYPE_ORDER_ENUM[newType])
    this.fsm.setParams(SPIKES_PARAMS_ENUM.SPIKES_TYPE, SPIKES_TYPE_ORDER_ENUM[newType])
  }

  get step() {
    return this._step
  }

  set step(newStep) {
    this._step = newStep
    this.fsm.setParams(SPIKES_PARAMS_ENUM.SPIKES_STEP, newStep)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH + TILE_HEIGHT * 0.5, -this.y * TILE_HEIGHT - TILE_HEIGHT * 0.5)
  }

  async init(params) {
    this.fsm = this.addComponent(SpikesStateMachine)
    this.fsm.animationComponent = this.addComponent(Animation)
    await this.fsm.init()

    let sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    let uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.type = params.type
    this.step = params.count

    this.x = params.x
    this.y = params.y

    this.setLoop()
  }

  setLoop() {
    setInterval(() => {
      if (this.step >= SPIKES_MAX_STEP[this.type]) {
        this.step = 0
      } else {
        this.step++
      }
    }, 1000)
  }
}

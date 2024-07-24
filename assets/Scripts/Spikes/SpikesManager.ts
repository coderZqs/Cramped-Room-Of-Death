import { Sprite, Component, UITransform, Animation } from 'cc'
import SpikesStateMachine from './SpikesStateMachine'
import { TILE_WIDTH, TILE_HEIGHT } from '../Enum/level'
import { EVENT_ENUM, SPIKES_MAX_STEP, SPIKES_PARAMS_ENUM, SPIKES_TYPE, SPIKES_TYPE_ORDER_ENUM } from '../Enum'
import EntityManager from '../Base/EntityManager'
import EventManager from '../Runtime/EventManager'
import DataManager from '../Runtime/DataManager'

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

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
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

    this.initParamsEvent()
  }

  initParamsEvent(): void {
    this.fsm.animationComponent.on(Animation.EventType.FINISHED, () => {
      let type = this.type
      let step = this.step

      if (
        (type === SPIKES_TYPE.SPIKES_ONE && step === SPIKES_MAX_STEP.SPIKES_ONE) ||
        (type === SPIKES_TYPE.SPIKES_TWO && step === SPIKES_MAX_STEP.SPIKES_TWO) ||
        (type === SPIKES_TYPE.SPIKES_THREE && step === SPIKES_MAX_STEP.SPIKES_THREE) ||
        (type === SPIKES_TYPE.SPIKES_FOUR && step === SPIKES_MAX_STEP.SPIKES_FOUR)
      ) {
        this.step = 0
      }
    })
  }

  onLoop() {
    if (this.step >= SPIKES_MAX_STEP[this.type]) {
      this.step = 0
    } else {
      this.step++
    }
  }

  onAttack() {
    let { x: playerX, y: playerY } = DataManager.Instance.player

    if (this.x === playerX && this.y === playerY && this.step === SPIKES_MAX_STEP[this.type]) {
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_DEATH)
    }
  }
}

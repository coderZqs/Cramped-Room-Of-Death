import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from './../Enum/index'
import { Sprite, UITransform, Component, _decorator } from 'cc'
import SmokeStateMachine from './SmokeStateMachine'
import StateMachine from '../Base/StateMachine'
import { IEntity, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import DataManager from '../Runtime/DataManager'

const { ccclass } = _decorator

export const FRAME_SPEED = 1 / 8

@ccclass('EntityManager')
export default class SmokeManager extends Component {
  public fsm: StateMachine
  public x = 0
  public y = 0
  public _direction = DIRECTION_ENUM.UP
  public _state

  async init(params: IEntity) {
    if (!DataManager.Instance.smoke) {
      const sprite = this.addComponent(Sprite)
      sprite.sizeMode = Sprite.SizeMode.CUSTOM

      const transform = this.addComponent(UITransform)
      transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

      this.fsm = this.addComponent(SmokeStateMachine)
      await this.fsm.init()
    }

    this.x = params.x
    this.y = params.y

    this.state = PARAMS_NAME_ENUM.DEATH

    this.state = params.state
    this.direction = params.direction
  }

  get state() {
    return this._state
  }

  set state(state) {
    this._state = state
    this.fsm.setParams(state, true)
  }

  get direction() {
    return this._direction
  }

  set direction(e) {
    this._direction = e
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[e])
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH + TILE_HEIGHT * 0.5, -this.y * TILE_HEIGHT - TILE_HEIGHT * 0.5)
  }
}

import { _decorator, Component, Sprite, UITransform } from 'cc'
import { IEntity, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import StateMachine from './StateMachine'
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import EventManager from '../Runtime/EventManager'
import DataManager from '../Runtime/DataManager'

const { ccclass } = _decorator

export const FRAME_SPEED = 1 / 8

@ccclass('EnemyManager')
export default class EnemyManager extends Component {
  public fsm: StateMachine
  public x = 0
  public y = 0
  public _direction = DIRECTION_ENUM.UP
  public _state

  async init(params: IEntity) {
    this.x = params.x
    this.y = params.y

    this.state = PARAMS_NAME_ENUM.IDLE
    this.direction = DIRECTION_ENUM.UP

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.changeDirectionByPlayer, this)

    this.changeDirectionByPlayer()
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.changeDirectionByPlayer)
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

  changeDirectionByPlayer() {
    let { x: playerX, y: playerY } = DataManager.Instance.player

    let offsetX = playerX - this.x
    let offsetY = playerY - this.y

    if (offsetX > 0 && offsetY > 0) {
      this.direction = offsetX > offsetY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
    } else if (offsetX < 0 && offsetY > 0) {
      this.direction = Math.abs(offsetX) > Math.abs(offsetY) ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM
    } else if (offsetX < 0 && offsetY < 0) {
      this.direction = Math.abs(offsetX) > Math.abs(offsetY) ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.UP
    } else if (offsetX > 0 && offsetY < 0) {
      this.direction = Math.abs(offsetX) > Math.abs(offsetY) ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.UP
    }
  }
}

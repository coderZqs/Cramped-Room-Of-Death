import { _decorator, Component, Sprite, UITransform } from 'cc'
import { IEnemy, IEntity, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import StateMachine from './StateMachine'
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../Enum'
import EventManager from '../Runtime/EventManager'
import DataManager from '../Runtime/DataManager'
import Utils from '../Utils'

const { ccclass } = _decorator

export const FRAME_SPEED = 1 / 8

@ccclass('EnemyManager')
export default class EnemyManager extends Component {
  public fsm: StateMachine
  public x = 0
  public y = 0
  public type: ENTITY_TYPE_ENUM
  public id = Utils.randomUUID()
  public _direction = DIRECTION_ENUM.UP
  public _state

  async init(params: IEnemy) {
    this.y = params.y
    this.x = params.x

    console.log(params)
    this.type = params.type

    this.state = params.state
    this.direction = params.direction

    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.changeDirectionByPlayer, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.changeDirectionByPlayer, this)
    EventManager.Instance.on(EVENT_ENUM.ENEMY_DEATH, this.onDeath, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.changeDirectionByPlayer)
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

  judgeDoorOpen() {
    let enemyGroup = DataManager.Instance.enemy

    if (enemyGroup.every(v => v.state === ENTITY_STATE_ENUM.DEATH)) {
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
    }
  }

  onDeath(enemyId) {
    if (enemyId === this.id) {
      if (this.state === PARAMS_NAME_ENUM.DEATH) {
        0
        return
      }

      this.state = PARAMS_NAME_ENUM.DEATH
    }

    this.judgeDoorOpen()
  }

  changeDirectionByPlayer() {
    if (this.state === PARAMS_NAME_ENUM.DEATH) {
      return
    }

    let { x: playerX, y: playerY } = DataManager.Instance.player

    let offsetX = playerX - this.x
    let offsetY = playerY - this.y

    if (offsetX >= 0 && offsetY >= 0) {
      this.direction = offsetX > offsetY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
    } else if (offsetX <= 0 && offsetY >= 0) {
      this.direction = Math.abs(offsetX) > Math.abs(offsetY) ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM
    } else if (offsetX <= 0 && offsetY <= 0) {
      this.direction = Math.abs(offsetX) > Math.abs(offsetY) ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.UP
    } else if (offsetX >= 0 && offsetY <= 0) {
      this.direction = Math.abs(offsetX) > Math.abs(offsetY) ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.UP
    }

    if (
      (Math.abs(this.x - playerX) === 1 && this.y === playerY) ||
      (Math.abs(this.y - playerY) === 1 && this.x === playerX)
    ) {
      this.state = PARAMS_NAME_ENUM.ATTACK
      console.log(this.x, this.y)
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_DEATH)
    }
  }
}

import { Sprite, UITransform, Component } from 'cc'
import StateMachine from '../Base/StateMachine'
import { TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import DoorStateMachine from './BurstStateMachine'
import EntityManager from '../Base/EntityManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../Enum/index'
import DataManager from '../Runtime/DataManager'
import EventManager from '../Runtime/EventManager'
import { EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enum'
import BurstStateMachine from './BurstStateMachine'

class BurstManager extends EntityManager {
  fsm: StateMachine
  public x = 0
  public y = 0
  public _state = ENTITY_STATE_ENUM.IDLE

  get state() {
    return this._state
  }

  set state(state) {
    this._state = state
    this.fsm.setParams(state, true)
  }

  async init(params) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()

    const transform = this.addComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    super.init(params)

    this.state = ENTITY_STATE_ENUM.IDLE

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH + TILE_HEIGHT * 0.5, -this.y * TILE_HEIGHT - TILE_HEIGHT * 0.5)
  }

  onAttack() {
    if (this.state !== ENTITY_STATE_ENUM.DEATH) {
      let { x: playerX, y: playerY } = DataManager.Instance.player

      if (playerX === this.x && playerY === this.y) {
        this.state = ENTITY_STATE_ENUM.ATTACK
      }
    }
  }
}

export default BurstManager

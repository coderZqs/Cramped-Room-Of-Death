import { _decorator, Component, SpriteFrame, animation, AnimationClip, Vec3, Sprite, UITransform, Animation } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import ResourceManager from '../Runtime/ResourceManager'
import StateMachine from '../Base/StateMachine'
import EventManager from '../Runtime/EventManager'
import { DIRECTION_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enum'

const { ccclass } = _decorator

export const FRAME_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  public fsm: StateMachine = null
  public targetX = 0
  public targetY = 0
  public x = 0
  public y = 0

  async start() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.addComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(StateMachine)
    await this.fsm.init()

    this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CONTROL, this.move, this)
  }

  update() {
    this.updateXY()

    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH / 2, this.y * TILE_HEIGHT - TILE_HEIGHT / 2)
  }

  updateXY() {
    if (this.x > this.targetX) {
      this.x -= 1
    } else if (this.x < this.targetX) {
      this.x += 1
    }

    if (this.y > this.targetY) {
      this.y -= 1
    } else if (this.y < this.targetY) {
      this.y += 1
    }

    if (Math.abs(this.x - this.targetX) < 0.1 && Math.abs(this.y - this.targetY) < 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  move(direction) {
    console.log(direction)
    if (direction === DIRECTION_ENUM.UP) {
      this.targetY += 1
    } else if (direction === DIRECTION_ENUM.BOTTOM) {
      this.targetY -= 1
    } else if (direction === DIRECTION_ENUM.LEFT) {
      this.targetX -= 1
    } else if (direction === DIRECTION_ENUM.RIGHT) {
      this.targetX += 1
    } else if (direction === DIRECTION_ENUM.TURN_LEFT) {
      this.fsm.setParams(PARAMS_NAME_ENUM.TURN_LEFT, true)
    }
  }
}

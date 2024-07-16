import { _decorator } from 'cc'
import PlayerStateMachine from './PlayerStateMachine'
import EventManager from '../Runtime/EventManager'
import {
  CONTROLLER_ENUM,
  ENTITY_STATE_ENUM,
  DIRECTION_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../Enum'
import EntityManager from '../Base/EntityManager'
import DataManager from '../Runtime/DataManager'

const { ccclass } = _decorator

export const FRAME_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  public targetX = 0
  public targetY = 0

  async start() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    this.init({
      x: 2,
      y: 8,
      direction: DIRECTION_ENUM.UP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.IDLE,
    })

    this.targetX = this.x
    this.targetY = this.y

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CONTROL, this.inputHandle, this)
  }

  update() {
    this.updateXY()
    super.update()
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

  inputHandle(direction) {
    if (this.willBlock(direction)) {
      return
    }

    this.move(direction)
  }

  willBlock(direction): boolean {
    console.log(direction, DIRECTION_ENUM.UP)
    if (direction === DIRECTION_ENUM.UP) {
      let weaponNextY = this.targetY - 2
      let playNextY = this.targetY - 1

      let playerTile = DataManager.Instance.tileInfo[this.targetX][playNextY]
      let weaponTile = DataManager.Instance.tileInfo[this.targetX][weaponNextY]

      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        return false
      } else {
        return true
      }
    }

    if (direction === DIRECTION_ENUM.BOTTOM) {
      let weaponNextY = this.targetY + 2
      let playNextY = this.targetY + 1

      let playerTile = DataManager.Instance.tileInfo[this.targetX][playNextY]
      let weaponTile = DataManager.Instance.tileInfo[this.targetX][weaponNextY]

      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        return false
      } else {
        return true
      }
    }

    if (direction === DIRECTION_ENUM.LEFT) {
      let weaponNextY = this.targetX - 2
      let playNextY = this.targetX - 1

      let playerTile = DataManager.Instance.tileInfo[this.targetX][playNextY]
      let weaponTile = DataManager.Instance.tileInfo[this.targetX][weaponNextY]

      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        return false
      } else {
        return true
      }
    }

    if (direction === DIRECTION_ENUM.RIGHT) {
      let weaponNextY = this.targetX + 2
      let playNextY = this.targetX + 1

      let playerTile = DataManager.Instance.tileInfo[this.targetX][playNextY]
      let weaponTile = DataManager.Instance.tileInfo[this.targetX][weaponNextY]

      if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
        return false
      } else {
        return true
      }
    }

    return true
  }

  move(control_direction) {
    if (control_direction === CONTROLLER_ENUM.UP) {
      this.targetY -= 1
    } else if (control_direction === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1
    } else if (control_direction === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
    } else if (control_direction === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1
    } else if (control_direction === CONTROLLER_ENUM.TURN_LEFT) {
      if (this.direction === DIRECTION_ENUM.UP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.UP
      }

      this.state = PARAMS_NAME_ENUM.TURN_LEFT
    } else if (control_direction === CONTROLLER_ENUM.TURN_RIGHT) {
      if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.UP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.UP
      }

      this.state = PARAMS_NAME_ENUM.TURN_RIGHT
    }
  }
}

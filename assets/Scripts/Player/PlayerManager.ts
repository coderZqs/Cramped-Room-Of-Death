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
  SHOCK_DIRECTION,
} from '../Enum'
import EntityManager from '../Base/EntityManager'
import DataManager from '../Runtime/DataManager'

const { ccclass } = _decorator

export const FRAME_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  public targetX = 0
  public targetY = 0
  public isMoving = false

  async init(params) {
    console.log(params)
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init(params)

    this.targetX = this.x
    this.targetY = this.y

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CONTROL, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_DEATH, this.onDeath, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CONTROL, this.inputHandle)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_DEATH, this.onDeath)
  }

  update() {
    this.updateXY()
    super.update()
  }

  updateXY() {
    if (this.x > this.targetX) {
      this.x -= FRAME_SPEED
    } else if (this.x < this.targetX) {
      this.x += FRAME_SPEED
    }

    if (this.y > this.targetY) {
      this.y -= FRAME_SPEED
    } else if (this.y < this.targetY) {
      this.y += FRAME_SPEED
    }

    if (Math.abs(this.x - this.targetX) < 0.1 && Math.abs(this.y - this.targetY) < 0.1 && this.isMoving) {
      this.x = this.targetX
      this.y = this.targetY

      this.isMoving = false

      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  inputHandle(direction) {
    if (this.willAttack()) {
      return
    }

    this.judgeBurstDeath()

    if (!this.willBlock(direction)) {
      this.move(direction)
    }

    this.judgeBurstAttack()
  }

  willBlock(direction): boolean {
    let { targetX: x, targetY: y } = this

    /**
     * 判断移动时是否会被阻挡
     */

    if ([CONTROLLER_ENUM.UP, CONTROLLER_ENUM.BOTTOM, CONTROLLER_ENUM.LEFT, CONTROLLER_ENUM.RIGHT].includes(direction)) {
      let nextX = 0
      let nextY = 0

      let weaponPoi = { x: 0, y: 0 }

      if (DIRECTION_ENUM.UP === this.direction) {
        weaponPoi = { x: x, y: y - 1 }
      } else if (DIRECTION_ENUM.BOTTOM === this.direction) {
        weaponPoi = { x: x, y: y + 1 }
      } else if (DIRECTION_ENUM.LEFT === this.direction) {
        weaponPoi = { x: x - 1, y: y }
      } else if (DIRECTION_ENUM.RIGHT === this.direction) {
        weaponPoi = { x: x + 1, y: y }
      }

      if (CONTROLLER_ENUM.UP === direction) {
        nextY = -1
      } else if (CONTROLLER_ENUM.BOTTOM === direction) {
        nextY = 1
      } else if (CONTROLLER_ENUM.LEFT === direction) {
        nextX = -1
      } else if (CONTROLLER_ENUM.RIGHT === direction) {
        nextX = 1
      }

      let playerNextPoi = { x: x + nextX, y: y + nextY }
      let weaponNextPoi = { x: weaponPoi.x + nextX, y: weaponPoi.y + nextY }

      let playerTile = DataManager.Instance.tileInfo[playerNextPoi.x][playerNextPoi.y]
      let weaponTile = DataManager.Instance.tileInfo[weaponNextPoi.x][weaponNextPoi.y]

      let enemy = DataManager.Instance.enemy.find(v => {
        return (
          (v.x === playerNextPoi.x && v.y === playerNextPoi.y) || (v.x === weaponNextPoi.x && v.y === weaponNextPoi.y)
        )
      })

      if (
        !playerTile ||
        (playerTile &&
          playerTile.moveable &&
          (!weaponTile || weaponTile.turnable) &&
          (!enemy || enemy.state === ENTITY_STATE_ENUM.DEATH))
      ) {
        return false
      } else {
        let params = ''
        let directions = ['BLOCK_UP', 'BLOCK_RIGHT', 'BLOCK_BOTTOM', 'BLOCK_LEFT']

        if (DIRECTION_ENUM.UP === this.direction) {
          let index = directions.findIndex(v => v.includes(direction))

          params = directions[index]
        } else if (DIRECTION_ENUM.BOTTOM === this.direction) {
          let index = directions.findIndex(v => v.includes(direction))
          params = directions[index + 2 <= 3 ? index + 2 : (index - 2) % 4]
        } else if (DIRECTION_ENUM.LEFT === this.direction) {
          let index = directions.findIndex(v => v.includes(direction))
          params = directions[index + 1 <= 3 ? index + 1 : (index - 1) % 4]
        } else if (DIRECTION_ENUM.RIGHT === this.direction) {
          let index = directions.findIndex(v => v.includes(direction))
          params = directions[index - 1 >= 0 ? index - 1 : 3 % (index - 1)]
        }

        console.log(params)

        if (direction === CONTROLLER_ENUM.UP || direction === CONTROLLER_ENUM.BOTTOM) {
          EventManager.Instance.emit(EVENT_ENUM.PLAYER_BLOCK, SHOCK_DIRECTION.VERTICAL)
        } else {
          EventManager.Instance.emit(EVENT_ENUM.PLAYER_BLOCK, SHOCK_DIRECTION.HORIZONTAL)
        }

        this.state = params
        return true
      }
    }

    /**
     * 判断旋转时是否会被阻挡
     */

    if ([CONTROLLER_ENUM.TURN_LEFT, CONTROLLER_ENUM.TURN_RIGHT].includes(direction)) {
      let ltPoi = {
        x: x - 1,
        y: y - 1,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.UP },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.LEFT },
        ],
      }
      let lbPoi = {
        x: x - 1,
        y: y + 1,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.LEFT },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.BOTTOM },
        ],
      }
      let rtPoi = {
        x: x + 1,
        y: y - 1,
        group: [
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.UP },
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.RIGHT },
        ],
      }
      let rbPoi = {
        x: x + 1,
        y: y + 1,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.BOTTOM },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.RIGHT },
        ],
      }
      let lPoi = {
        x: x - 1,
        y: y,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.UP },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.BOTTOM },
        ],
      }
      let tPoi = {
        x: x,
        y: y - 1,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.RIGHT },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.LEFT },
        ],
      }
      let bPoi = {
        x: x,
        y: y + 1,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.LEFT },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.RIGHT },
        ],
      }
      let rPoi = {
        x: x + 1,
        y: y,
        group: [
          { direction: CONTROLLER_ENUM.TURN_LEFT, player_direction: DIRECTION_ENUM.BOTTOM },
          { direction: CONTROLLER_ENUM.TURN_RIGHT, player_direction: DIRECTION_ENUM.UP },
        ],
      }

      let weaponNextPoi = [ltPoi, lbPoi, rtPoi, rbPoi].find(v => {
        return v.group.some(poi => {
          return poi.player_direction === this.direction && poi.direction === direction
        })
      })

      let weaponTurnFirstPoi = [lPoi, bPoi, tPoi, rPoi].find(v => {
        return v.group.some(poi => {
          return poi.player_direction === this.direction && poi.direction === direction
        })
      })

      let weaponNextPoiTile = DataManager.Instance.tileInfo[weaponNextPoi.x][weaponNextPoi.y]
      let weaponTurnFirstPoiTile = DataManager.Instance.tileInfo[weaponTurnFirstPoi.x][weaponTurnFirstPoi.y]

      let enemy = DataManager.Instance.enemy.find(v => {
        return (
          (v.x === weaponNextPoi.x && v.y === weaponNextPoi.y) ||
          (v.x === weaponTurnFirstPoi.x && v.y === weaponTurnFirstPoi.y)
        )
      })

      if (
        ((weaponNextPoiTile && weaponNextPoiTile.turnable) || !weaponNextPoiTile) &&
        ((weaponTurnFirstPoiTile && weaponTurnFirstPoiTile.turnable) || !weaponTurnFirstPoiTile) &&
        (!enemy || enemy.state === ENTITY_STATE_ENUM.DEATH)
      ) {
        return false
      } else {
        if (CONTROLLER_ENUM.TURN_LEFT === direction) {
          this.state = PARAMS_NAME_ENUM.BLOCK_TURN_LEFT
        } else if (CONTROLLER_ENUM.TURN_RIGHT === direction) {
          this.state = PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT
        }

        return true
      }
    }
  }

  judgeBurstAttack() {
    let burst = DataManager.Instance.burst

    burst.forEach(v => {
      if (v.x === this.targetX && v.y === this.targetY) {
        v.state = ENTITY_STATE_ENUM.DEATH
      }
    })
  }

  judgeBurstDeath() {
    let burst = DataManager.Instance.burst
    let playerTile = DataManager.Instance.tileInfo[this.targetX][this.targetY]

    if (
      !playerTile ||
      burst.find(v => v.x === this.targetX && v.y === this.targetY)?.state === ENTITY_STATE_ENUM.DEATH
    ) {
      this.state = ENTITY_STATE_ENUM.AIRDEATH
    }
  }

  move(controlDirection) {
    this.isMoving = true

    if (
      controlDirection === CONTROLLER_ENUM.UP ||
      controlDirection === CONTROLLER_ENUM.BOTTOM ||
      controlDirection === CONTROLLER_ENUM.LEFT ||
      controlDirection === CONTROLLER_ENUM.RIGHT
    ) {
      EventManager.Instance.emit(EVENT_ENUM.SMOKE_GENERATE, { x: this.x, y: this.y, direction: controlDirection })
    }

    if (controlDirection === CONTROLLER_ENUM.UP) {
      this.targetY -= 1
    } else if (controlDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1
    } else if (controlDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
    } else if (controlDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1
    } else if (controlDirection === CONTROLLER_ENUM.TURN_LEFT) {
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
    } else if (controlDirection === CONTROLLER_ENUM.TURN_RIGHT) {
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

  willAttack() {
    let enemyGroup = DataManager.Instance.enemy

    for (let i = 0; i < enemyGroup.length; i++) {
      if (
        (this.direction === DIRECTION_ENUM.UP && this.targetY - 2 === enemyGroup[i].y && this.x === enemyGroup[i].x) ||
        (this.direction === DIRECTION_ENUM.BOTTOM &&
          this.targetY + 2 === enemyGroup[i].y &&
          this.x === enemyGroup[i].x) ||
        (this.direction === DIRECTION_ENUM.LEFT &&
          this.targetX - 2 === enemyGroup[i].x &&
          this.y === enemyGroup[i].y) ||
        (this.direction === DIRECTION_ENUM.RIGHT && this.targetX + 2 === enemyGroup[i].x && this.y === enemyGroup[i].y)
      ) {
        if (enemyGroup[i].state !== ENTITY_STATE_ENUM.DEATH) {
          this.state = ENTITY_STATE_ENUM.ATTACK
          EventManager.Instance.emit(EVENT_ENUM.ENEMY_DEATH, enemyGroup[i].id)

          return true
        } else {
          return false
        }
      }
    }

    return false
  }

  onDeath() {
    this.state = PARAMS_NAME_ENUM.DEATH
  }
}

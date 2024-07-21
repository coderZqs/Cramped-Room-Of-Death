import { _decorator, Component, Node, UITransform, Sprite } from 'cc'
import Utils from '../Utils'
import { TileMapManager } from '../Tile/TileMapManager'
import { ILevel, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import { Levels } from '../Levels'

import DataManager from '../Runtime/DataManager'
import { ENTITY_TYPE_ENUM, EVENT_ENUM } from '../Enum'
import EventManager from '../Runtime/EventManager'
import { PlayerManager } from '../Player/PlayerManager'
import WoodenSkeletonManager from '../Enemy/WoordenSkeletonManager'
import IronSkeletonManager from '../IronSkeleton/IronSkeletonManager'
import EnemyManager from '../Base/EnemyManager'
import DoorManager from '../Door/DoorManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enum/index'
import BurstManager from '../Burst/BurstManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel
  stage: Node = null

  protected onLoad(): void {
    this.loadLevel()
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrival, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrival)
  }

  initLevel() {
    const level = Levels[`Level${DataManager.Instance.levelIndex}`]
    this.level = level

    DataManager.Instance.mapColCount = level.mapInfo.length
    DataManager.Instance.mapRowCount = level.mapInfo[0].length
    DataManager.Instance.mapInfo = level.mapInfo

    this.generateTileMap()
  }

  nextLevel() {
    this.clearLevel()
    DataManager.Instance.levelIndex++
    this.loadLevel()
  }

  generateStage() {
    this.stage = Utils.createNode('stage')
    this.stage.setParent(this.node)
  }

  generatePlayer() {
    let player = Utils.createNode('player')
    let playerManager = player.addComponent(PlayerManager)
    playerManager.init(this.level.player)
    player.setParent(this.stage)

    player.setSiblingIndex(5)

    DataManager.Instance.player = playerManager
  }

  generateEnemy() {
    let enemyGroup = []

    this.level.enemies.forEach(enemyInfo => {
      let enemy = Utils.createNode()
      let enemyManager: EnemyManager = null
      if (enemyInfo.type === ENTITY_TYPE_ENUM.WOODENSKELETON) {
        enemyManager = enemy.addComponent(WoodenSkeletonManager)
      } else {
        enemyManager = enemy.addComponent(IronSkeletonManager)
      }

      enemyManager.init(enemyInfo)

      enemyGroup.push(enemyManager)
      enemy.setParent(this.stage)
    })

    DataManager.Instance.enemy = enemyGroup
  }

  generateDoor() {
    let door = Utils.createNode('door')
    door.setParent(this.stage)
    let doorManager = door.addComponent(DoorManager)
    doorManager.init(this.level.door)

    DataManager.Instance.door = doorManager
  }

  generateBurst() {
    this.level.bursts.forEach(burstInfo => {
      let burst = Utils.createNode('burst')
      burst.setParent(this.stage)
      let burstManager = burst.addComponent(BurstManager)
      burstManager.init(burstInfo)

      DataManager.Instance.burst.push(burstManager)
    })
  }

  generateTileMap() {
    const tileMap = Utils.createNode('tileMap')
    tileMap.setParent(this.stage)

    const tileMapManager = tileMap.addComponent(TileMapManager)
    tileMapManager.init()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }

  loadLevel() {
    this.generateStage()
    this.initLevel()
    this.adoptPos()
    this.generateEnemy()
    this.generateDoor()
    this.generateBurst()
    this.generatePlayer()
  }

  adoptPos() {
    const { mapRowCount, mapColCount } = DataManager.Instance
    this.stage.setPosition((-mapRowCount * TILE_WIDTH) / 2, (mapColCount * TILE_HEIGHT) / 2 + 80)
  }

  checkArrival() {
    let { door, player } = DataManager.Instance

    if (door.state === ENTITY_STATE_ENUM.DEATH && player.x === door.x && player.y === door.y) {
      this.nextLevel()
    }
  }
}

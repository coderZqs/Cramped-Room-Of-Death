import { _decorator, Component, Node, UITransform, Sprite } from 'cc'
import Utils from '../Utils'
import { TileMapManager } from '../Tile/TileMapManager'
import { ILevel, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import { Levels } from '../Levels'

import DataManager from '../Runtime/DataManager'
import { ENTITY_TYPE_ENUM, EVENT_ENUM, SHOCK_DIRECTION } from '../Enum'
import EventManager from '../Runtime/EventManager'
import { PlayerManager } from '../Player/PlayerManager'
import WoodenSkeletonManager from '../Enemy/WoordenSkeletonManager'
import IronSkeletonManager from '../IronSkeleton/IronSkeletonManager'
import EnemyManager from '../Base/EnemyManager'
import DoorManager from '../Door/DoorManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enum/index'
import BurstManager from '../Burst/BurstManager'
import SpikesManager from '../Spikes/SpikesManager'
import SmokeManager from '../Smoke/SmokeManager'
import FadeManager from '../Fade/FadeManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel
  stage: Node = null
  fadeManager: FadeManager
  static shockTimer: number = null

  protected onLoad(): void {
    this.fadeManager = this.addComponent(FadeManager)
    this.loadLevel()

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrival, this)
    EventManager.Instance.on(EVENT_ENUM.SMOKE_GENERATE, this.generateSmoke, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BLOCK, this.onShock, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrival)
    EventManager.Instance.off(EVENT_ENUM.SMOKE_GENERATE, this.generateSmoke)
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

  async generatePlayer() {
    let player = Utils.createNode('player')
    let playerManager = player.addComponent(PlayerManager)
    player.setParent(this.stage)
    await playerManager.init(this.level.player)
    DataManager.Instance.player = playerManager

    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)
  }

  async generateSmoke(
    params = { x: 0, y: 0, direction: DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE, type: ENTITY_TYPE_ENUM.SMOKE },
  ) {
    let smokePool = DataManager.Instance.smoke

    if (smokePool) {
      smokePool.init(params)
    } else {
      let smoke = Utils.createNode('smoke')
      smoke.setParent(this.stage)
      let smokeManager = smoke.addComponent(SmokeManager)
      await smokeManager.init(params)

      DataManager.Instance.smoke = smokeManager
    }
  }

  async generateSpikes() {
    let spikes = []
    let promises: Array<Promise<any>> = []

    this.level.spikes.forEach(spikeInfo => {
      let spike = Utils.createNode('spike')
      spike.setParent(this.stage)
      let spikeManager = spike.addComponent(SpikesManager)

      promises.push(spikeManager.init(spikeInfo))
      spikes.push(spikeManager)
    })

    DataManager.Instance.spikes = spikes

    await Promise.all(promises)
  }

  async generateEnemy() {
    let enemyGroup = []
    let promises: Array<Promise<any>> = []

    this.level.enemies.forEach(enemyInfo => {
      let enemy = Utils.createNode()
      let enemyManager: EnemyManager = null
      if (enemyInfo.type === ENTITY_TYPE_ENUM.WOODENSKELETON) {
        enemyManager = enemy.addComponent(WoodenSkeletonManager)
      } else {
        enemyManager = enemy.addComponent(IronSkeletonManager)
      }

      promises.push(enemyManager.init(enemyInfo))

      enemyGroup.push(enemyManager)
      enemy.setParent(this.stage)
    })

    DataManager.Instance.enemy = enemyGroup
    await Promise.all(promises)
  }

  async generateDoor() {
    let door = Utils.createNode('door')
    door.setParent(this.stage)
    let doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)

    DataManager.Instance.door = doorManager
  }

  async generateBurst() {
    let promises: Array<Promise<any>> = []

    this.level.bursts.forEach(burstInfo => {
      let burst = Utils.createNode('burst')
      burst.setParent(this.stage)
      let burstManager = burst.addComponent(BurstManager)
      promises.push(burstManager.init(burstInfo))

      DataManager.Instance.burst.push(burstManager)
    })

    await Promise.all(promises)
  }

  async generateTileMap() {
    const tileMap = Utils.createNode('tileMap')
    tileMap.setParent(this.stage)

    const tileMapManager = tileMap.addComponent(TileMapManager)
    await tileMapManager.init()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }

  async loadLevel() {
    this.fadeManager.setAlpha(0.1)

    await Promise.all([
      this.generateStage(),
      this.initLevel(),
      this.adoptPos(),
      /*       this.generateEnemy(),
      this.generateDoor(),
      this.generateBurst(),
      this.generateSpikes(),
      this.generateSmoke(), */
    ])

    await this.generatePlayer()
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

  onShock(direction: SHOCK_DIRECTION) {
    clearInterval(BattleManager.shockTimer)
    const SHOCK_DURATION = 500
    const FRAME = 1000 / 60

    let endTime = new Date().getTime() + SHOCK_DURATION

    let index = 0
    const shock_amplitude = 2

    BattleManager.shockTimer = setInterval(() => {
      if (endTime < new Date().getTime()) {
        clearInterval(BattleManager.shockTimer)
        return
      }

      index++
      let { x, y } = this.stage.position

      if (direction === SHOCK_DIRECTION.HORIZONTAL) {
        this.stage.setPosition(x + Math.cos(index) * shock_amplitude, y)
      } else {
        this.stage.setPosition(x, y + Math.cos(index) * shock_amplitude)
      }
    }, FRAME)
  }
}

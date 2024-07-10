import { _decorator, Component, Node, UITransform, Sprite } from 'cc'
import Utils from '../Utils'
import { TileMapManager } from '../Tile/TileMapManager'
import { ILevel, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import { Levels } from '../Levels'

import DataManager from '../Runtime/DataManager'
import { EVENT_ENUM } from '../Enum'
import EventManager from '../Runtime/EventManager'
import { PlayerManager } from '../Player/PlayerManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel
  stage: Node = null
  player: Node = null

  protected onLoad(): void {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
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
    this.initLevel()
  }

  generateStage() {
    this.stage = Utils.createNode('stage')
    this.stage.setParent(this.node)
  }

  generatePlayer() {
    this.player = Utils.createNode('player')
    this.player.addComponent(PlayerManager)
    this.player.setParent(this.stage)
    // this.player.layer = 10
  }

  generateTileMap() {
    const tileMap = Utils.createNode('tileMap')
    tileMap.setParent(this.stage)

    const tileMapManager = tileMap.addComponent(TileMapManager)
    tileMapManager.init()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
  }

  start() {
    this.generateStage()
    this.initLevel()
    this.adoptPos()
    this.generatePlayer()
  }

  adoptPos() {
    const { mapRowCount, mapColCount } = DataManager.Instance
    this.stage.setPosition((-mapRowCount * TILE_WIDTH) / 2, (mapColCount * TILE_HEIGHT) / 2 + 120)
  }
}

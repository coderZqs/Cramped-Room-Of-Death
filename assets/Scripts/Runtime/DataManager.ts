import { Node } from 'cc'
import SingleTon from '../Base/SingleTon'
import { ILevel, ITile } from './../Enum/level'
import { PlayerManager } from '../Player/PlayerManager'
import EnemyManager from '../Base/EnemyManager'
import BurstManager from '../Burst/BurstManager'
import DoorManager from '../Door/DoorManager'
import { ISpikes } from '../Enum'

class DataManager extends SingleTon {
  static get Instance() {
    return this.getInstance<DataManager>()
  }

  tileInfo: Array<Array<ITile>>
  mapInfo: ILevel['mapInfo']
  mapRowCount: ILevel['rowCount']
  mapColCount: ILevel['colCount']
  levelIndex: number = 3
  player: PlayerManager = null
  enemy: Array<EnemyManager> = []
  burst: Array<BurstManager> = []
  door: DoorManager = null
  spikes: Array<ISpikes> = []

  reset() {
    //地图信息
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0

    // //活动元素信息
    this.player = null
    this.enemy = []
    // this.spikes = []
    this.burst = []
    this.door = null
    // this.smokes = []

    // this.records = []
  }
}

export default DataManager

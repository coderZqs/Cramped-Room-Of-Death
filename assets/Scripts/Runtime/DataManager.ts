import { Node } from 'cc'
import SingleTon from '../Base/SingleTon'
import { ILevel, ITile } from './../Enum/level'
import { PlayerManager } from '../Player/PlayerManager'

class DataManager extends SingleTon {
  static get Instance() {
    return this.getInstance<DataManager>()
  }

  tileInfo: Array<Array<ITile>>
  mapInfo: ILevel['mapInfo']
  mapRowCount: ILevel['rowCount']
  mapColCount: ILevel['colCount']
  levelIndex: number = 1
  player: PlayerManager = null
}

export default DataManager

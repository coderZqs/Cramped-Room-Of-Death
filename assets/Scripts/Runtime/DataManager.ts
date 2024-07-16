import SingleTon from '../Base/SingleTon'
import { ILevel, ITile } from './../Enum/level'

class DataManager extends SingleTon {
  static get Instance() {
    return this.getInstance<DataManager>()
  }

  tileInfo: Array<Array<ITile>>
  mapInfo: ILevel['mapInfo']
  mapRowCount: ILevel['rowCount']
  mapColCount: ILevel['colCount']
  levelIndex: number = 1
}

export default DataManager

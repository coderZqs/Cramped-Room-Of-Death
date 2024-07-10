import SingleTon from '../Base/SingleTon'
import { ILevel } from './../Enum/level'

class DataManager extends SingleTon {
  static get Instance() {
    return this.getInstance<DataManager>()
  }

  mapInfo: ILevel['mapInfo']
  mapRowCount: ILevel['rowCount']
  mapColCount: ILevel['colCount']
  levelIndex: number = 1
}

export default DataManager

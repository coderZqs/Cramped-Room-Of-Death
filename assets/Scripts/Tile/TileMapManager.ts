import { _decorator, Component, math, Node } from 'cc'
import { Levels } from '../Levels/index'
import Utils from '../Utils/index'
import { TileManager } from './TileManager'
import ResourceManager from '../Runtime/ResourceManager'
import DataManager from '../Runtime/DataManager'

const { ccclass, property } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    DataManager.Instance.tileInfo = []
    const spriteFrame = await ResourceManager.Instance.loadRes('texture/tile/tile')

    const mapInfo = Levels['Level' + DataManager.Instance.levelIndex].mapInfo
    for (let i = 0; i < mapInfo.length; i++) {
      DataManager.Instance.tileInfo[i] = []
      const column = mapInfo[i]

      for (let j = 0; j < column.length; j++) {
        let { src, type } = column[j]

        if (src === null || type === null) {
          continue
        }

        if ((src === 1 || src === 5 || src === 9) && i % 2 === 0 && j % 2 === 0) {
          src = src + math.randomRangeInt(0, 4)
        }

        const imgSrc = `tile (${src})`

        const index = spriteFrame.findIndex(e => e.name === imgSrc)
        const frame = spriteFrame[index]

        const tile = Utils.createNode()
        const tileManager = tile.addComponent(TileManager)

        DataManager.Instance.tileInfo[i][j] = tileManager

        tileManager.init(type, frame, i, j)
        tile.setParent(this.node)
      }
    }
  }

  update(deltaTime: number) {}
}

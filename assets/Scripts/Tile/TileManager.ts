import { _decorator, Component, Node, UITransform, Sprite } from 'cc'
import { TILE_HEIGHT, TILE_TYPE_ENUM, TILE_WIDTH } from '../Enum/level'
const { ccclass } = _decorator

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  src: string
  moveable: boolean
  turnable: boolean
  init(type, spriteFrame, i, j) {
    this.type = type
    if (
      this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_ROW ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_COLUMN
    ) {
      this.moveable = false
      this.turnable = false
    } else if (
      this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.moveable = false
      this.turnable = true
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.moveable = true
      this.turnable = true
    }

    const uiTransform = this.getComponent(UITransform)
    const sprite = this.node.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}

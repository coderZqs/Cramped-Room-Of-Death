import { _decorator, Component, Node, UITransform, Sprite } from 'cc'
import Utils from '../Utils'
import { TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
const { ccclass, property } = _decorator

@ccclass('TileManager')
export class TileManager extends Component {
  init(spriteFrame, i, j) {
    const uiTransform = this.getComponent(UITransform)
    const sprite = this.node.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}

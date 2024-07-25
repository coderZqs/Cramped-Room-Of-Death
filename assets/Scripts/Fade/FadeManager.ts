import { Canvas, Component, Graphics, view, _decorator, Color, BlockInputEvents, UITransform } from 'cc'

const { ccclass } = _decorator

const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height

@ccclass('FadeManager')
class FadeManager extends Component {
  block: BlockInputEvents
  ctx: Graphics

  protected onLoad(): void {
    this.init()
  }

  init() {
    this.block = this.node.addComponent(BlockInputEvents)
    let uiTransform = this.node.getComponent(UITransform)
    uiTransform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    uiTransform.setAnchorPoint(0.5, 0.5)
    this.ctx = this.addComponent(Graphics)
  }

  setAlpha(percent) {
    this.ctx.clear()
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.block.enabled = percent === 1
  }
}

export default FadeManager

import { _decorator, Component, SpriteFrame, animation, AnimationClip, Vec3, Sprite, UITransform, Animation } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import ResourceManager from '../Runtime/ResourceManager'

const { ccclass } = _decorator

const FRAME_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  async start() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const uiTransform = this.getComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    const animationClip = new AnimationClip()

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')

    let spriteFrame = await ResourceManager.Instance.loadRes('texture/player/idle/top')
    let frames: Array<[number, SpriteFrame]> = spriteFrame.map((item, index) => [FRAME_SPEED * index, item])

    track.channel.curve.assignSorted(frames)
    animationClip.addTrack(track)

    animationClip.duration = frames.length * FRAME_SPEED
    animationClip.wrapMode = AnimationClip.WrapMode.Loop

    let animationComponent = this.addComponent(Animation)
    animationComponent.defaultClip = animationClip
    animationComponent.play()
  }
}

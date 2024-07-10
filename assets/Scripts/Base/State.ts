import { AnimationClip, animation, SpriteFrame, Sprite } from 'cc'
import StateMachine from './StateMachine'
import ResourceManager from '../Runtime/ResourceManager'
import { FRAME_SPEED } from '../Player/PlayerManager'

class State {
  public animationClip: AnimationClip
  public constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Loop,
  ) {
    this.init()
  }

  async init() {
    let promise = ResourceManager.Instance.loadRes(this.path)
    this.fsm.waitingList.push(promise)

    let spriteFrame = await promise
    this.animationClip = new AnimationClip()

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    let frames: Array<[number, SpriteFrame]> = spriteFrame.map((item, index) => [FRAME_SPEED * index, item])

    track.channel.curve.assignSorted(frames)
    this.animationClip.addTrack(track)

    this.animationClip.duration = frames.length * FRAME_SPEED
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}

export default State

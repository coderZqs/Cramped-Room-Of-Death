import { AnimationClip, animation, SpriteFrame, Sprite } from 'cc'
import StateMachine from './StateMachine'
import ResourceManager from '../Runtime/ResourceManager'
import { FRAME_SPEED } from '../Player/PlayerManager'
import SubStateMachine from './SubStateMachine'
import Utils from '../Utils'
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum'

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
    this.animationClip.name = this.path

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    let frames: Array<[number, SpriteFrame]> = Utils.sortSpriteFrame(spriteFrame).map((item, index) => [
      FRAME_SPEED * index,
      item,
    ])

    track.channel.curve.assignSorted(frames)
    this.animationClip.addTrack(track)

    this.animationClip.duration = frames.length * FRAME_SPEED
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    if (this.fsm.animationComponent.defaultClip?.name === this.animationClip.name) {
      return
    }

    console.log(this.animationClip.name)

    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}

export default State

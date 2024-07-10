import { _decorator, Component, Node, Animation, animation, input, Input, EventTouch } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PlayTest')
export class PlayTest extends Component {
  _direction: number = 0
  _type: string = 'Idle'

  animationController: animation.AnimationController = null

  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
    this.animationController = this.getComponent(animation.AnimationController)

    console.log(this.animationController.getVariables())
  }

  onKeyDown(e) {
    switch (e.keyCode) {
      case 81:
        this._type = 'Turn_Left'
        break
      case 69:
        this._type = 'Turn_Right'
        break
      case 37:
        this._direction = 1
        this._type = 'Idle'
        break
      case 39:
        this._direction = 3
        this._type = 'Idle'
        break
      case 40:
        this._direction = 4
        this._type = 'Idle'
        break
      case 38:
        this._direction = 2
        this._type = 'Idle'
        break
    }

    this.animationController.setValue(this._type, true)
    this.animationController.setValue('Direction', this._direction)

    console.log(this.animationController.getValue('Direction'))
    console.log(this.animationController.getValue('Turn_Left'))
    console.log(this.animationController.getValue('Turn_Right'))
    console.log(this.animationController.getValue('Idle'))
  }

  update(deltaTime: number) {}
}

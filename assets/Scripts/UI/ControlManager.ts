import { _decorator, Component, Node } from 'cc'
import { EVENT_ENUM } from '../Enum'
import EventManager from '../Runtime/EventManager'
const { ccclass, property } = _decorator

@ccclass('ControlManager')
export class ControlManager extends Component {
  handleControl() {
    EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
  }
}

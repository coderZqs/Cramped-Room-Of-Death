import { Sprite, UITransform } from 'cc'
import StateMachine from '../Base/StateMachine'
import { IEntity, TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import DoorStateMachine from './DoorStateMachine'
import EntityManager from '../Base/EntityManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../Enum/index'
import DataManager from '../Runtime/DataManager'
import EventManager from '../Runtime/EventManager'
import { EVENT_ENUM } from '../Enum'

class DoorManager extends EntityManager {
  fsm: StateMachine

  async init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.addComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()

    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)
  }

  onOpen() {
    this.state = ENTITY_STATE_ENUM.DEATH
  }
}

export default DoorManager

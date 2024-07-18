import { DIRECTION_ENUM, PARAMS_NAME_ENUM } from './../Enum/index'
import { Sprite, UITransform } from 'cc'
import WoodenSkeletonsStateMachine from './WoodenSkeletonStateMachine'
import StateMachine from '../Base/StateMachine'
import { ENTITY_STATE_ENUM } from '../Enum'
import { TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import EnemyManager from '../Base/EnemyManager'
import { ENTITY_TYPE_ENUM } from '../Enum/index'

class WoodenSkeletonManager extends EnemyManager {
  fsm: StateMachine

  async start() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.addComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(WoodenSkeletonsStateMachine)
    await this.fsm.init()

    this.init({ x: 9, y: 4, direction: DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE, type: ENTITY_TYPE_ENUM.IDLE })
  }
}

export default WoodenSkeletonManager

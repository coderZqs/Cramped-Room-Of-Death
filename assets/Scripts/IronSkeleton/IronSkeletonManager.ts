import { DIRECTION_ENUM, PARAMS_NAME_ENUM } from './../Enum/index'
import { Sprite, UITransform } from 'cc'
import IronSkeletonStateMachine from './IronSkeletonStateMachine'
import StateMachine from '../Base/StateMachine'
import { ENTITY_STATE_ENUM } from '../Enum'
import { TILE_HEIGHT, TILE_WIDTH } from '../Enum/level'
import EnemyManager from '../Base/EnemyManager'
import { ENTITY_TYPE_ENUM } from '../Enum/index'

class WoodenSkeletonManager extends EnemyManager {
  fsm: StateMachine

  async init(params) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.addComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)
  }
}

export default WoodenSkeletonManager

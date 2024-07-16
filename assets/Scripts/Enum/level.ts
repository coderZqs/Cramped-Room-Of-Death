import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../Enum/index'

export enum TILE_TYPE_ENUM {
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  WALL_TOP = 'WALL_TOP',
  WALL_BOTTOM = 'WALL_BOTTOM',
  CLIFF_CENTER = 'CLIFF_CENTER',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  CLIFF_LEFT = 'CLIFF_LEFT',
  CLIFF_TOP = 'CLIFF_TOP',
  CLIFF_BOTTOM = 'CLIFF_BOTTOM',
  WALL_ROW = 'WALL_ROW',
  FLOOR = 'FLOOR',
}

export interface ITile {
  src: number
  type: TILE_TYPE_ENUM
  moveable: boolean
  turnable: boolean
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
  colCount: number
  rowCount: number
}

export interface IEntity {
  x: number
  y: number
  direction: DIRECTION_ENUM
  state: ENTITY_STATE_ENUM
  type: ENTITY_TYPE_ENUM
}

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

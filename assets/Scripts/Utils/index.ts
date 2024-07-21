import { Node, UITransform, Vec2, SpriteFrame } from 'cc'

const createNode = (name?: string) => {
  const node = new Node(name)
  const uiTransform = node.addComponent(UITransform)
  uiTransform.anchorPoint = new Vec2(0, 1)

  return node
}

const randomUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const sortSpriteFrame = (spriteFrame: Array<SpriteFrame>) => {
  const INDEX_REG = /\((\d+)\)/
  const getNumberWithinString = (str: string) => parseInt(str.match(INDEX_REG)?.[1] || '0')
  return spriteFrame.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
}

export default {
  randomUUID,
  createNode,
  sortSpriteFrame,
}

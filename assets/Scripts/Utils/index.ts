import { Node, UITransform, Vec2 } from 'cc'

const createNode = (name?: string) => {
  const node = new Node(name)
  const uiTransform = node.addComponent(UITransform)
  uiTransform.anchorPoint = new Vec2(0, 1)

  return node
}

export default {
  createNode,
}

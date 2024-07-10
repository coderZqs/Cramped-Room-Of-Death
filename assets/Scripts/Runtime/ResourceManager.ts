import SingleTon from '../Base/SingleTon'
import { SpriteFrame, resources } from 'cc'

class ResourceManager extends SingleTon {
  static get Instance() {
    return this.getInstance<ResourceManager>()
  }

  loadRes(url: string): Promise<SpriteFrame[]> {
    return new Promise((resolve, reject) => {
      resources.loadDir(url, SpriteFrame, (err, spriteFrames: SpriteFrame[]) => {
        if (err) {
          reject(err)
          return
        }

        resolve(spriteFrames)
      })
    })
  }
}

export default ResourceManager

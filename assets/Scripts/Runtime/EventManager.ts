import SingleTon from '../Base/SingleTon'

interface IItem {
  func: Function
  ctx: unknown
}

class EventManager extends SingleTon {
  static get Instance() {
    return this.getInstance<EventManager>()
  }

  events: Map<string, Array<IItem>> = new Map()

  on(event: string, func: Function, ctx?: unknown) {
    if (this.events.has(event)) {
      this.events.get(event).push({ ctx: ctx, func: func })
    } else {
      this.events.set(event, [{ func, ctx }])
    }
  }

  off(event: string, func: Function) {
    if (this.events.has(event)) {
      const index = this.events.get(event).findIndex(i => func === i.func)
      index > -1 && this.events.get(event).splice(index, 1)
    }
  }

  emit(event: string, ...params: unknown[]) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, params) : func(...params)
      })
    }
  }
}

export default EventManager

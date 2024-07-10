class SingleTon {
  private static _instance
  static getInstance<T>(): T {
    if (!this._instance) {
      this._instance = new this()
    }
    return this._instance
  }
}

export default SingleTon

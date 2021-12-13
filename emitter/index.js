;(function (GLOBAL) {
  // 注册事件处理器
  function mixin(obj) {
    for (const key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key]
      obj.eventHandlerMap = new Map()
    }
    return obj
  }
  function Emitter(obj) {
    this.eventHandlerMap = new Map()
    if (obj) return mixin(obj)
  }

  // 注册事件处理器
  Emitter.prototype.on = function (event, fn) {
    if (this.eventHandlerMap.has(event)) {
      typeof fn === 'function' && this.eventHandlerMap.get(event).push(fn)
    } else {
      this.eventHandlerMap.set(event, [fn])
    }
  }

  // 发射一个带有可变选项 args 的事件
  Emitter.prototype.emit = function (event, ...args) {
    const fns = this.eventHandlerMap.get(event)
    if (fns && fns.length) {
      fns.forEach((fn) => fn && fn(...args))
    }
  }

  Emitter.prototype.off = function (event, fn) {
    if (arguments.length === 0) {
      // 移除所有 listener
      this.eventHandlerMap.clear()
    } else if (arguments.length === 1) {
      // 移除 event 下所有的 listener
      const fns = this.eventHandlerMap.get(event)
      fns.length = 0
    } else if (arguments.length === 2) {
      const fns = this.eventHandlerMap.get(event)
      if (fns && fns.length) {
        const index = fns.findIndex(
          (listener) => listener === fn || listener.fn === fn
        )
        if (index > -1) {
          fns[index] = null // 避免改变 fns 长度，导致 emit 遍历错误
          // 延时删除
          setTimeout(() => {
            fns.splice(index, 1)
          }, 0)
        }
      }
    }
  }

  // 注册一个单次事件处理程序 fn，在它第一次被调用后立即删除
  Emitter.prototype.once = function (event, fn) {
    const callback = (...args) => {
      typeof fn === 'function' && fn(...args)
      this.off(event, callback)
    }
    callback.fn = fn
    this.on(event, callback)
  }

  // 获取 event 下所有的 listener
  Emitter.prototype.listeners = function (event) {
    const fns = this.eventHandlerMap.get(event)
    if (fns && fns.length) {
      return fns
    } else {
      return []
    }
  }

  Emitter.prototype.hasListeners = function (event) {
    const fns = this.eventHandlerMap.get(event)
    return !!(fns && fns.length)
  }

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Emitter
    })

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Emitter

    //Browser.
  } else {
    GLOBAL.Emitter = Emitter
  }
})(this)

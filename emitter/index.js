(function (GLOBAL) {
  function Emitter() {
    this.eventHandlerMap = new Map();
  }

  // 注册事件处理器
  Emitter.prototype.on = function (event, fn) {
    if (this.eventHandlerMap.has(event)) {
      typeof fn === 'function' && this.eventHandlerMap.get(event).push(fn);
    } else {
      this.eventHandlerMap.set(event, [fn]);
    }
  };

  // 发射一个带有可变选项 args 的事件
  Emitter.prototype.emit = function (event, ...args) {
    const fns = this.eventHandlerMap.get(event);
    if (fns && fns.length) {
      fns.forEach((fn) => fn(...args));
    }
  };

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Emitter;
    });

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Emitter;

    //Browser.
  } else {
    GLOBAL.Emitter = Emitter;
  }
})(this);

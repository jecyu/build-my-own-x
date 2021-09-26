(function (GLOBAL) {
  const util = {
    extend(target) {
      for (let i = 1, len = arguments.length; i < len; i++) {
        for (let prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop];
          }
        }
      }

      return target;
    },
    // 基于 requestAnimationFrame 的节流
    throttleByAnimationFrame(func) {
      let isThrottle = false;
      let requestId = null;
      let savedArgs = null;
      let savedThis = null;
      const throttled = function (...args) {
        if (isThrottle) {
          savedArgs = args;
          savedThis = this;
          return;
        }

        func.apply(this, args);
        requestId = requestAnimationFrame(() => {
          if (savedArgs) {
            throttled.apply(savedThis, savedArgs);
            savedThis = savedArgs = null;
            requestId = null;
          }
        });

        throttled.cancal = () => cancelAnimationFrame(requestId);
        isThrottle = null;
      };

      return throttled;
    },
  };

  function BackTop(el, options) {
    this.el = el;
    this.options = util.extend({}, this.constructor.defaultOptions, options);
    this.init();
    return this;
  }

  BackTop.defaultOptions = {
    // 默认回到顶部的时间
    duration: 500,
  };

  BackTop.prototype.init = function () {
    this.bind();
    return this;
  };

  BackTop.prototype.bind = function () {
    // 监听当前文档的滚动状态
    window.addEventListener('scroll', this.onScroll.bind(this), false);
    // 初始化 backTop scroll 状态
    this.onScroll();
    // 给当前元素绑定点击事件
    this.el.addEventListener('click', this.onClick.bind(this), false);
    return this;
  };

  BackTop.prototype.unbind = function () {
    window.removeEventListener('scroll', this.onScroll.bind(this), false);
    this.el.removeEventListener('click', this.onClick.bind(this), false);
  };

  BackTop.prototype.destroy = function () {
    this.unbind();
    return this;
  };

  BackTop.prototype.onScroll = util.throttleByAnimationFrame(function () {
    this.toggleElement();
  });

  BackTop.prototype.toggleElement = function () {
    // 显示/隐藏 backTop 元素
    if (window.pageYOffset < 50) {
      // addClass()
      this.el.classList.add('hidden');
    } else {
      // removeClass()
      this.el.classList.remove('hidden');
    }
  };

  BackTop.prototype.onClick = function () {
    const { duration } = this.options;
    const s = window.pageYOffset; // 获取距离目标位置的大小
    this.animate({
      duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        window.scrollTo(0, s - progress * s);
      },
    });
  };

  BackTop.prototype.animate = function ({ timing, draw, duration }) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      // timeFraction 从 0 增加到 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      // 计算当前动画状态
      let progress = timing(timeFraction);

      draw(progress); // 绘制

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  };

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return BackTop;
    });

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackTop;

    //Browser.
  } else {
    GLOBAL.BackTop = BackTop;
  }
})(this);

;(function (GLOBAL) {
  const util = {
    extend(target) {
      for (let i = 1, len = arguments.length; i < len; i++) {
        for (let prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop]
          }
        }
      }
      return target
    },
    addClass(el, className) {
      if (el.classList) {
        el.classList.add(className)
      } else {
        if (!util.hasClass(el, className)) {
          el.className = `${el.className} ${className}`
        }
      }
    },
    hasClass(el, className) {
      if (el.classList) {
        return el.classList.contains(className)
      }
      const originClass = el.className
      return ` ${originClass} `.indexOf(` ${className} `) > -1
    },
    setStyle(element, style) {
      const oldStyle = {}

      const styleKeys = Object.keys(style)

      styleKeys.forEach((key) => {
        oldStyle[key] = element.style[key]
      })

      styleKeys.forEach((key) => {
        element.style[key] = style[key]
      })

      return oldStyle
    },
  }

  function Breadcrumb(el, options) {
    this.el = el
    this.options = util.extend({}, this.constructor.defaultOptions, options)
    this.init()
    return this
  }

  Breadcrumb.defaultOptions = {}

  Breadcrumb.prototype.init = function () {
    this.render()
    return this
  }

  // 渲染视图
  Breadcrumb.prototype.render = function () {}

  Breadcrumb.prototype.bind = function () {
    return this
  }

  Breadcrumb.prototype.unbind = function () {}

  Breadcrumb.prototype.destroy = function () {
    this.unbind()
    return this
  }

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Breadcrumb
    })

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Breadcrumb

    //Browser.
  } else {
    GLOBAL.Breadcrumb = Breadcrumb
  }
})(this)

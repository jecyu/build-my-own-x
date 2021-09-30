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

  function Swipe(el, options) {
    this.el = el
    this.options = util.extend({}, this.constructor.defaultOptions, options)
    this.init()
    return this
  }

  Swipe.defaultOptions = {}

  Swipe.prototype.init = function () {
    this.render()
    return this
  }

  // 渲染视图
  Swipe.prototype.render = function () {
    this.el.append(this.renderSwiper())
  }

  Swipe.prototype.renderSwiper = function () {
    const div = document.createElement('div')
    util.addClass(div, 'nalu-swipe')
    const ul = document.createElement('ul')

    const { data } = this.options
    const result = data.map((item) => {
      return this.renderSwiperItem(item)
    })
    ul.append(...result)
    div.append(ul)
    return div
  }

  Swipe.prototype.renderSwiperItem = function (data) {
    const { item } = data
    const swipeItemWrapper = document.createElement('li')
    util.addClass(swipeItemWrapper, 'swipe-item-wrapper')

    const swipeItem = document.createElement('div')
    util.addClass(swipeItem, 'swipe-item')
    swipeItemWrapper.append(swipeItem)

    // item-inner
    const inner = document.createElement('div')
    inner.append(document.createTextNode(item.text))
    util.addClass(inner, 'swipe-item-inner')
    swipeItem.append(inner)

    return swipeItemWrapper
  }

  Swipe.prototype.bind = function () {
    return this
  }

  Swipe.prototype.unbind = function () {}

  Swipe.prototype.destroy = function () {
    this.unbind()
    return this
  }

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Swipe
    })

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Swipe

    //Browser.
  } else {
    GLOBAL.Swipe = Swipe
  }
})(this)

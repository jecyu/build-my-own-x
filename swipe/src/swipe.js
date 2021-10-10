import "./swipe.css"

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
  }
}

const STATE_SHRINK = 0
const STATE_GROW = 1

function Swipe(el, options) {
  this.el = el
  this.refs = {}
  this.options = util.extend({}, this.constructor.defaultOptions, options)
  this.init()
  return this
}

Swipe.defaultOptions = {}

Swipe.prototype.init = function () {
  this.render()
  this.bind()
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

  this.refs.swipe = div
  return div
}

Swipe.prototype.renderSwiperItem = function (data) {
  const { item, btns } = data
  const swipeItemWrapper = document.createElement('li')
  util.addClass(swipeItemWrapper, 'swipe-item-wrapper')

  const swipeItem = document.createElement('div')
  util.addClass(swipeItem, 'swipe-item')
  swipeItem.setAttribute('data-type', 0)

  // item-inner
  const inner = document.createElement('div')
  const span = document.createElement('span')
  span.append(document.createTextNode(item.text))
  inner.append(span)

  util.addClass(inner, 'swipe-item-inner')
  swipeItem.append(inner)

  // btns
  swipeItem.append(this.renderSwiperBtns(btns))

  swipeItemWrapper.append(swipeItem)
  return swipeItemWrapper
}

Swipe.prototype.renderSwiperBtns = function (btns) {
  const ul = document.createElement('ul')
  util.addClass(ul, 'swipe-btns')
  const btnNodes = btns.map((btn) => {
    const li = document.createElement('li')
    util.addClass(li, 'swipe-btn')
    const span = document.createElement('span')
    util.addClass(span, 'text')
    span.append(document.createTextNode(btn.text))

    util.setStyle(li, { backgroundColor: btn.color })
    li.append(span)
    return li
  })
  ul.append(...btnNodes)

  return ul
}

Swipe.prototype.bind = function () {
  this.refs.swipe.addEventListener(
    'touchstart',
    this.onTouchStart.bind(this),
    false
  )
  this.refs.swipe.addEventListener(
    'touchmove',
    this.onTouchMove.bind(this),
    false
  )
  this.refs.swipe.addEventListener(
    'touchend',
    this.onTouchEnd.bind(this),
    false
  )
  return this
}

Swipe.prototype.unbind = function () {}

Swipe.prototype.destroy = function () {
  this.unbind()
  return this
}

Swipe.prototype.getTouchTarget = function (e) {
  let target = e.target
  while (target && !target.classList.contains('swipe-item')) {
    target = target.parentElement
  }
  return target
}

Swipe.prototype.onTouchStart = function (e) {
  const target = this.getTouchTarget(e)
  if (!target.classList.contains('swipe-item')) return

  const point = e.touches[0]
  this.startX = point.pageX
}

Swipe.prototype.onTouchMove = function (e) {
  // e.preventDefault()
  // const target = this.getTouchTarget(e)
  // if (!target.classList.contains('swipe-item')) return
  // const point = e.touches[0]
  // this.endX = point.pageX
  // const deltaX = this.startX - this.endX
  // util.setStyle(target, { transform: `translate3d(${-deltaX}px, 0, 0)` })
}

Swipe.prototype.onTouchEnd = function (e) {
  const target = this.getTouchTarget(e)
  if (!target.classList.contains('swipe-item')) return
  const point = e.changedTouches[0]
  this.endX = point.pageX
  const delatX = this.startX - this.endX
  // 左滑
  if (target.dataset.type == 0 && delatX > 30) {
    this.restSlide()
    target.dataset.type = 1
  }
  // 右滑
  if (target.dataset.type == 1 && delatX < -30) {
    this.restSlide()
    target.dataset.type = 0
  }
  this.startX = 0
  this.endX = 0
}

Swipe.prototype._translate = function () {}

//复位滑动状态
Swipe.prototype.restSlide = function () {
  let swiperItems = document.querySelectorAll('.swipe-item')
  // 复位
  for (let i = 0; i < swiperItems.length; i++) {
    swiperItems[i].dataset.type = 0
  }
}

export default Swipe

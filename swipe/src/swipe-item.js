import Emitter from './emitter'
import { addClass, extend, setStyle, getRect } from './util'

const STATE_SHRINK = 0
const STATE_GROW = 1
const DIRECTION_LEFT = 1
const DIRECTION_RIGHT = -1
const EVENT_SCROLL = 'scroll'
const easingTime = 600
const easeOutQuart = 'cubic-bezier(0.165, 0.84, 0.44, 1)'

/**
 * {item, btns, index, autoShrink}
 * @param {*}
 */
function SwipeItem(options) {
  // created
  this.options = extend({}, this.constructor.defaultOptions, options)
  this.refs = {}
  this.scrollerStyle = null // 记录当前滚动项的样式对象
  this.state = STATE_SHRINK // 记录状态，默认是缩起，

  this.x = 0 // 当前滑动偏移的 x 值，可以用来计算出每次新偏移的值 newX = this.x + deltaX，每次 touchMove 时进行更新
  this.pointX = 0 // 当前手指触摸点的 x 值
  this.maxScrollX = 0 // 向左滑动的最大距离
  this.movingDirectionX = 0 // 手指滑动方向

  Emitter(this) // 添加 emitter 能力
  const { swipeStore } = this.options
  swipeStore.swipe.addItem(this) // 调用父组件的 addItem 方法把自身实例 push 到父组件的 this.items 数组里收集起来
}

SwipeItem.defaultOptions = {}

SwipeItem.prototype.init = function () {
  // mounted
  this.refs.swipeItem = this.render()
  this.scrollerStyle = this.refs.swipeItem.style
  this.bind()
  setTimeout(() => {
    this.refresh() // 需要等按钮完全挂载到 dom 树后，才能获取相关的宽高位置
  })
  return this.refs.swipeItem
}

SwipeItem.prototype.bind = function () {
  this.onTouchStart = this.onTouchStart.bind(this)
  this.onTouchMove = this.onTouchMove.bind(this) // 记录绑定后的函数，方便卸载
  this.onTouchEnd = this.onTouchEnd.bind(this)
  this._handleBtns = this._handleBtns.bind(this)
  this._translateBtns = this._translateBtns.bind(this)

  this.refs.swipeItem.addEventListener('touchstart', this.onTouchStart, false)

  this.refs.swipeItem.addEventListener('touchmove', this.onTouchMove, false)

  this.refs.swipeItem.addEventListener('touchend', this.onTouchEnd, false)
  this.on(EVENT_SCROLL, this._handleBtns)
}

SwipeItem.prototype.unbind = function () {
  this.refs.swipeItem.removeEventListener(
    'touchstart',
    this.onTouchStart,
    false
  )
  this.refs.swipeItem.removeEventListener('touchmove', this.onTouchMove, false)

  this.refs.swipeItem.removeEventListener('touchend', this.onTouchEnd, false)
}

SwipeItem.prototype.destroy = function () {
  this.unbind()
}

/*
 * 计算出按钮的总长度，用于标识向左滑动的最大距离。
 */
SwipeItem.prototype.refresh = function () {
  const { btns } = this.options
  if (btns.length > 0) {
    this._initCachedBtns()
    this._calculateBtnsWidth()
  }
}

/**
 * 记录按钮宽度大小，
 * 最后生成形如[ {width: 50}, {width: 50 } ] 这样的记录
 */
SwipeItem.prototype._initCachedBtns = function () {
  this.cachedBtns = []
  const len = this.refs.btns.length
  for (let i = 0; i < len; i++) {
    this.cachedBtns.push({
      width: getRect(this.refs.btns[i]).width
    })
  }
}

/**
 * 计算出按钮的总长度，用于标识向左滑动的最大距离。
 */
SwipeItem.prototype._calculateBtnsWidth = function () {
  let width = 0
  const len = this.cachedBtns.length
  for (let i = 0; i < len; i++) {
    width += this.cachedBtns[i].width
  }
  this.maxScrollX = -width
}

/**
 * 根据当前的x值驱动每个按钮去做向左滑动动画，动态处理按钮的位置
 * grow：要实现刚开始向左移动 swipe-item 时，每个按钮都是重叠在一起的，然后根据 swipe-item 移动的 x ，每个按钮慢慢通过 translate 移动到合适的位置，最终达到每个按钮并排一起。这样很多按钮时，用户也能够快速预览下。
 * shrink：收缩时，逐步移动 btn 向右移动 translate 效果即可。
 * 然后在 grow 和 shrink 的临界点通过 _translateBtns 矫正每个按钮的位置，因为 handleBtns 处理 translate 时，有可能中途缩开，这样每个按钮移动的点就不是达到并排（grow时）的效果，会有间隔。
 * 每个 btn 的初始化位置为，由于样式上统一设置了 left：100%，会跟随在 item 后面。那么依次后面的每个 btn的移动位置，都向右前面 n - 1 个按钮相加的宽度
 * @param {*} x
 * @returns
 */
SwipeItem.prototype._handleBtns = function (x) {
  if (this.refs.btns.length === 0) {
    return
  }
  const len = this.refs.btns.length
  let delta = 0
  let totalWidth = -this.maxScrollX
  for (let i = 0; i < len; i++) {
    const btn = this.refs.btns[i]
    let rate = (totalWidth - delta) / totalWidth // 1. 得出当前按钮向左移动的比率，通过总宽度 - 排在前面的按钮宽度总和，再除以总宽度得到剩下的按钮所占的比例。
    let translate = (rate - 1) * x // 2. 再通过 1 - rate 得出当前按钮向左移动的比例即为前面按钮的宽度比例，这样就保证越往后的按钮，translate 移动的比例越大，保证所有按钮能够同时出现

    if (x < this.maxScrollX) {
      // 大于最大移动距离时，直接并排好，在 grow 和 shrink 则由 _translateBtn 处理
      translate = delta
    }

    delta += this.cachedBtns[i].width
    btn.style['transform'] = `translate(${translate}px)`
  }
}

/**
 * 遍历btn组的dom节点，
 * 给按钮也设置一系列css transform 让按钮一个个做对应的动画
 */
SwipeItem.prototype._translateBtns = function (time, easing) {
  // 如果没有 btns 就什么也不做
  if (this.refs.btns.length === 0) {
    return
  }

  const len = this.refs.btns.length
  let delta = 0
  let translate = 0
  for (let i = 0; i < len; i++) {
    const btn = this.refs.btns[i]
    if (this.state === STATE_GROW) {
      translate = delta
    } else {
      // shrink
      translate = 0
    }
    delta += this.cachedBtns[i].width
    btn.style.transform = `translate(${translate}px, 0) translateZ(0)`
    btn.style.transitionProperty = 'all'
    btn.style.transitionTimingFunction = easing
    btn.style.transitionDuration = time
  }
}

SwipeItem.prototype.onTouchStart = function (e) {
  this.options.swipeStore.swipe.onItemActive(this.options.index) // 首先通知父组件“我被触摸了”， 这里调用父 swipe 组件的 onItemActive

  const point = e.touches[0]
  this.pointX = point.pageX
}

/**
 * 根据当前手指的x值和start时的x值 调用_translate让dom去做一些偏移
 * @param {*} e
 */
SwipeItem.prototype.onTouchMove = function (e) {
  // 阻止浏览器默认 touch 行为，比如页面滚动
  e.preventDefault()
  const point = e.touches[0]

  // 相对于上次触发 touchmove 时候横向的偏移量 deltaX
  let deltaX = point.pageX - this.pointX

  // 记录最新的 ponitX
  this.pointX = point.pageX

  // movingDirectionX 滑动的方向，如果 deltaX 大于 0，则是向右滑动 -1
  // 如果 deltaX 小于 0 则是左滑 -1，如果等于 0，则记录为 0
  this.movingDirectionX =
    deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0

  // newX 拿到了到上次 move 为止偏移的 x 值
  // 加上本次move偏移的deltaX值
  // 计算出newX也就是下一次应该_translate到x位置值，
  // 这个值一定是负数，因为我们的按钮组一定是向左做偏移translateX(-x)
  // 当然这个值不能直接交给_translate方法 我们要做一些边界值处理
  let newX = this.x + deltaX

  // 不能大于 0 的边界限制，保证向右滑动不能超出边缘
  if (newX > 0) {
    newX = 0
  }

  // 调用_translate 真正去操作dom左偏移的行为
  this._translate(newX, true)

  // 触发EVENT_SCROLL事件 带出当前的x值。
  this.emit(EVENT_SCROLL, this.x)
}

SwipeItem.prototype.onTouchEnd = function (e) {
  // 动距离x比最大滑动距离的一半要小 就展开
  if (this.x < this.maxScrollX / 2) {
    this.grow()
  } else {
    // 否则收起
    this.shrink()
  }
}

/**
 * 把 x 值写入dom样式里 并且 translateZ(0) 开启硬件加速
 */
SwipeItem.prototype._translate = function (x, useZ) {
  let translateZ = useZ ? 'translateZ(0)' : ''
  this.scrollerStyle.transform = `translate(${x}px,0)${translateZ}`
  this.x = x // 更新实例上的 this.x
}

SwipeItem.prototype.grow = function () {
  // 状态记录为展开状态
  this.state = STATE_GROW
  // 调用 scrollTo，值定义为完全展开的值
  this.scrollTo(this.maxScrollX)
  // 调用_translateBtns让按钮组做动画
  this._translateBtns(easingTime, easeOutQuart)
}

SwipeItem.prototype.shrink = function () {
  this.state = STATE_SHRINK
  this._translate(0, true)
  this._translateBtns(easingTime, easeOutQuart)
}

SwipeItem.prototype.scrollTo = function (x) {
  // 设定transformX值 开始执行动画
  this._translate(x, true)
}

SwipeItem.prototype.renderSwiperBtns = function (btns) {
  const ul = document.createElement('ul')
  addClass(ul, 'swipe-btns')
  const btnNodes = btns.map((btn) => {
    const li = document.createElement('li')
    addClass(li, 'swipe-btn')
    const span = document.createElement('span')
    addClass(span, 'text')
    span.append(document.createTextNode(btn.text))

    setStyle(li, { backgroundColor: btn.color })
    li.append(span)
    return li
  })
  this.refs.btns = btnNodes
  ul.append(...btnNodes)
  return ul
}

SwipeItem.prototype.render = function () {
  const { item, btns } = this.options
  const swipeItem = document.createElement('li')
  addClass(swipeItem, 'swipe-item')
  swipeItem.setAttribute('data-type', 0)

  // item-inner
  const inner = document.createElement('div')
  const span = document.createElement('span')
  span.append(document.createTextNode(item.text))
  inner.append(span)

  addClass(inner, 'swipe-item-inner')
  swipeItem.append(inner)

  // btns
  swipeItem.append(this.renderSwiperBtns(btns))

  return swipeItem
}

export default SwipeItem

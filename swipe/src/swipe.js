import SwipeItem from './swipe-item'
import './swipe.css'
import { addClass, extend, setStyle } from './util'
function Swipe(el, options) {
  this.el = el
  this.refs = {}
  this.options = extend({}, this.constructor.defaultOptions, options)
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
  addClass(div, 'nalu-swipe')
  const ul = document.createElement('ul')

  const { data } = this.options
  const result = data.map((item, index) => {
    return this.renderSwiperItem(item, index)
  })
  ul.append(...result)
  div.append(ul)

  this.refs.swipe = div
  return div
}

Swipe.prototype.renderSwiperItem = function (data, index) {
  const swipeItem = new SwipeItem({ ...data, index })
  return swipeItem.init()
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
  // setStyle(target, { transform: `translate3d(${-deltaX}px, 0, 0)` })
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

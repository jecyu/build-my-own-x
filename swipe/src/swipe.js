import SwipeStore from './swipe-store'

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
  this.swipeStore = new SwipeStore({ swipe: this })
  this.items = [] // 收集 swipe-item 实例
  this.activeIndex = -1 // 当前激活的 item
  this.render()
  this.bind()
  return this
}

Swipe.prototype.unbind = function () {}

Swipe.prototype.destroy = function () {
  this.unbind()
  return this
}

/**
 * 如果父元素中有已经被触摸左滑展开的swipe-item记录 并且和这个新的swipe-item不是同一个 就通知上一个子组件shrink() 收起， 并且在swipe组件中记录this.activeIndex = index新的子组件序号
 */
Swipe.prototype.onItemActive = function (index) {}

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
  const { swipeStore } = this
  const swipeItem = new SwipeItem({ ...data, index, swipeStore })
  return swipeItem.init()
}

Swipe.prototype.bind = function () {
  return this
}

Swipe.prototype.addItem = function (item) {
  this.items.push(item)
}

export default Swipe

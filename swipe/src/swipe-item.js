import { addClass, extend, setStyle } from './util'

const STATE_SHRINK = 0
const STATE_GROW = 1

/**
 * {item, btns, index, autoShrink}
 * @param {*}
 */
function SwipeItem(options) {
  this.options = extend({}, this.constructor.defaultOptions, options)
  this.x = 0 // 用来记录滑动偏移的量
  this.state = STATE_SHRINK // 用来记录状态，默认是缩起，
  // this.swipe.addItem(this) // 调用父组件的 addItem 方法把自身实例 push 到父组件的 this.items 数组里收集起来
  this.refs = {}
}

SwipeItem.defaultOptions = {}

SwipeItem.prototype.init = function () {
  this.refs.swipeItem = this.render()
  return this.refs.swipeItem
}

SwipeItem.prototype.render = function () {
  const { item, btns } = this.options
  const swipeItemWrapper = document.createElement('li')
  addClass(swipeItemWrapper, 'swipe-item-wrapper')

  const swipeItem = document.createElement('div')
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

  swipeItemWrapper.append(swipeItem)
  return swipeItemWrapper
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
  ul.append(...btnNodes)

  return ul
}

export default SwipeItem

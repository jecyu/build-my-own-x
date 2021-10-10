/**
 *
 * @param {*}
 */
function SwipeItem({ item, btns, index, autoShrink }) {
  this.x = 0 // 用来记录滑动偏移的量
  this.state = STATE_SHRINK // 用来记录状态，默认是缩起，
  // this.swipe.addItem(this) // 调用父组件的addItem方法把自身实例push到父组件的 this.items数组里收集起来
  this.init()
}

SwipeItem.prototype.init = function () {
  this.render()
}

SwipeItem.prototype.render = function () {}

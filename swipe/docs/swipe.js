(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swipe = factory());
})(this, (function () { 'use strict';

  function SwipeStore({ swipe }) {
    this.swipe = swipe;
  }

  function extend(target) {
    for (let i = 1, len = arguments.length; i < len; i++) {
      for (let prop in arguments[i]) {
        if (arguments[i].hasOwnProperty(prop)) {
          target[prop] = arguments[i][prop];
        }
      }
    }
    return target
  }

  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      if (!util.hasClass(el, className)) {
        el.className = `${el.className} ${className}`;
      }
    }
  }

  function setStyle(element, style) {
    const oldStyle = {};

    const styleKeys = Object.keys(style);

    styleKeys.forEach((key) => {
      oldStyle[key] = element.style[key];
    });

    styleKeys.forEach((key) => {
      element.style[key] = style[key];
    });

    return oldStyle
  }

  function getRect(el) {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }

  const STATE_SHRINK = 0;
  const STATE_GROW = 1;
  const DIRECTION_LEFT = 1;
  const DIRECTION_RIGHT = -1;

  /**
   * {item, btns, index, autoShrink}
   * @param {*}
   */
  function SwipeItem(options) {
    // created
    this.options = extend({}, this.constructor.defaultOptions, options);
    this.refs = {};
    this.scrollerStyle = null; // 记录当前滚动项的样式对象
    this.state = STATE_SHRINK; // 记录状态，默认是缩起，

    this.x = 0; // 当前滑动偏移的 x 值，可以用来计算出每次新偏移的值 newX = this.x + deltaX，每次 touchMove 时进行更新
    this.pointX = 0; // 当前手指触摸点的 x 值
    this.maxScrollX = 0; // 向左滑动的最大距离
    this.movingDirectionX = 0; // 手指滑动方向

    const { swipeStore } = this.options;
    swipeStore.swipe.addItem(this); // 调用父组件的 addItem 方法把自身实例 push 到父组件的 this.items 数组里收集起来
  }

  SwipeItem.defaultOptions = {};

  SwipeItem.prototype.init = function () {
    // mounted
    this.refs.swipeItem = this.render();
    this.scrollerStyle = this.refs.swipeItem.style;
    this.bind();
    setTimeout(() => {
      this.refresh(); // 需要等按钮完全挂载到 dom 树后，才能获取相关的宽高位置
    });
    return this.refs.swipeItem
  };

  SwipeItem.prototype.bind = function () {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this); // 记录绑定后的函数，方便卸载
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.refs.swipeItem.addEventListener('touchstart', this.onTouchStart, false);

    this.refs.swipeItem.addEventListener('touchmove', this.onTouchMove, false);

    this.refs.swipeItem.addEventListener('touchend', this.onTouchEnd, false);
  };

  SwipeItem.prototype.unbind = function () {
    this.refs.swipeItem.removeEventListener(
      'touchstart',
      this.onTouchStart,
      false
    );
    this.refs.swipeItem.removeEventListener('touchmove', this.onTouchMove, false);

    this.refs.swipeItem.removeEventListener('touchend', this.onTouchEnd, false);
  };

  SwipeItem.prototype.destroy = function () {
    this.unbind();
  };

  /*
   * 计算出按钮的总长度，用于标识向左滑动的最大距离。
   */
  SwipeItem.prototype.refresh = function () {
    const { btns } = this.options;
    if (btns.length > 0) {
      this._initCachedBtns();
      this._calculateBtnsWidth();
    }
  };

  /**
   * 记录按钮宽度大小，
   * 最后生成形如[ {width: 50}, {width: 50 } ] 这样的记录
   */
  SwipeItem.prototype._initCachedBtns = function () {
    this.cachedBtns = [];
    const len = this.refs.btns.length;
    for (let i = 0; i < len; i++) {
      this.cachedBtns.push({
        width: getRect(this.refs.btns[i]).width
      });
    }
  };

  /**
   * 计算出按钮的总长度，用于标识向左滑动的最大距离。
   */
  SwipeItem.prototype._calculateBtnsWidth = function () {
    let width = 0;
    const len = this.cachedBtns.length;
    for (let i = 0; i < len; i++) {
      width += this.cachedBtns[i].width;
    }
    this.maxScrollX = -width;
  };

  SwipeItem.prototype.onTouchStart = function (e) {
    this.options.swipeStore.swipe.onItemActive(this.options.index); // 首先通知父组件“我被触摸了”， 这里调用父 swipe 组件的 onItemActive

    const point = e.touches[0];
    this.pointX = point.pageX;
  };

  /**
   * 根据当前手指的x值和start时的x值 调用_translate让dom去做一些偏移
   * @param {*} e
   */
  SwipeItem.prototype.onTouchMove = function (e) {
    // 阻止浏览器默认 touch 行为，比如页面滚动
    e.preventDefault();
    const point = e.touches[0];

    // 相对于上次触发 touchmove 时候横向的偏移量 deltaX
    let deltaX = point.pageX - this.pointX;

    // 记录最新的 ponitX
    this.pointX = point.pageX;

    // movingDirectionX 滑动的方向，如果 deltaX 大于 0，则是向右滑动 -1
    // 如果 deltaX 小于 0 则是左滑 -1，如果等于 0，则记录为 0
    this.movingDirectionX =
      deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0;

    // newX 拿到了到上次 move 为止偏移的 x 值
    // 加上本次move偏移的deltaX值
    // 计算出newX也就是下一次应该_translate到x位置值，
    // 这个值一定是负数，因为我们的按钮组一定是向左做偏移translateX(-x)
    // 当然这个值不能直接交给_translate方法 我们要做一些边界值处理
    let newX = this.x + deltaX;

    // 不能大于 0 的边界限制，保证向右滑动不能超出边缘
    if (newX > 0) {
      newX = 0;
    }

    // 调用_translate 真正去操作dom左偏移的行为
    this._translate(newX, true);
  };

  SwipeItem.prototype.onTouchEnd = function (e) {
    // 动距离x比最大滑动距离的一半要小 就展开
    if (this.x < this.maxScrollX / 2) {
      this.grow();
    } else {
      // 否则收起
      this.shrink();
    }
  };

  /**
   * 把 x 值写入dom样式里 并且 translateZ(0) 开启硬件加速
   */
  SwipeItem.prototype._translate = function (x, useZ) {
    let translateZ = useZ ? 'translateZ(0)' : '';
    this.scrollerStyle.transform = `translate(${x}px,0)${translateZ}`;
    this.x = x; // 更新实例上的 this.x
  };

  SwipeItem.prototype.grow = function () {
    // 状态记录为展开状态
    this.state = STATE_GROW;
    // 调用 scrollTo，值定义为完全展开的值
    this.scrollTo(this.maxScrollX);
  };

  SwipeItem.prototype.shrink = function () {
    this.state = STATE_SHRINK;
    this._translate(0, true);
  };

  SwipeItem.prototype.scrollTo = function (x) {
    // 设定transformX值 开始执行动画
    this._translate(x, true);
  };

  SwipeItem.prototype.renderSwiperBtns = function (btns) {
    const ul = document.createElement('ul');
    addClass(ul, 'swipe-btns');
    const btnNodes = btns.map((btn) => {
      const li = document.createElement('li');
      addClass(li, 'swipe-btn');
      const span = document.createElement('span');
      addClass(span, 'text');
      span.append(document.createTextNode(btn.text));

      setStyle(li, { backgroundColor: btn.color });
      li.append(span);
      return li
    });
    this.refs.btns = btnNodes;
    ul.append(...btnNodes);
    return ul
  };

  SwipeItem.prototype.render = function () {
    const { item, btns } = this.options;
    const swipeItemWrapper = document.createElement('li');
    addClass(swipeItemWrapper, 'swipe-item-wrapper');

    const swipeItem = document.createElement('div');
    addClass(swipeItem, 'swipe-item');
    swipeItem.setAttribute('data-type', 0);

    // item-inner
    const inner = document.createElement('div');
    const span = document.createElement('span');
    span.append(document.createTextNode(item.text));
    inner.append(span);

    addClass(inner, 'swipe-item-inner');
    swipeItem.append(inner);

    // btns
    swipeItem.append(this.renderSwiperBtns(btns));
    swipeItemWrapper.append(swipeItem);

    return swipeItemWrapper
  };

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "ul,\nli {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.swipe-item-wrapper {\n  display: flex;\n  border-bottom: 1px solid #ccc;\n  align-items: center;\n  overflow: hidden;\n}\n\n.swipe-item {\n  position: relative;\n  width: 100%;\n  transition: transform 0.2s;\n}\n\n.swipe-item[data-type='0'] {\n  transform: translate3d(0, 0, 0);\n}\n.swipe-item[data-type='1'] {\n  transform: translate3d(-100px, 0, 0);\n}\n\n.swipe-item-inner {\n  height: 60px;\n  line-height: 60px;\n  box-sizing: border-box;\n  padding-left: 20px;\n  font-size: 16px;\n}\n\n.swipe-btn {\n  display: flex;\n  align-items: center;\n  text-align: left;\n\n  position: absolute;\n  top: 0;\n  left: 100%;\n  height: 100%;\n  font-size: 16px;\n}\n\n.swipe-btn .text {\n  flex: 1;\n  white-space: nowrap;\n  color: #fff;\n  padding: 0 20px;\n}\n";
  styleInject(css_248z);

  function Swipe(el, options) {
    this.el = el;
    this.refs = {};
    this.options = extend({}, this.constructor.defaultOptions, options);
    this.init();
    return this
  }

  Swipe.defaultOptions = {};

  Swipe.prototype.init = function () {
    this.swipeStore = new SwipeStore({ swipe: this });
    this.items = []; // 收集 swipe-item 实例
    this.activeIndex = -1; // 当前激活的 item
    this.render();
    this.bind();
    return this
  };

  Swipe.prototype.unbind = function () {};

  Swipe.prototype.destroy = function () {
    this.unbind();
    return this
  };

  /**
   * 如果父元素中有已经被触摸左滑展开的swipe-item记录 并且和这个新的swipe-item不是同一个 就通知上一个子组件shrink() 收起， 并且在swipe组件中记录this.activeIndex = index新的子组件序号
   */
  Swipe.prototype.onItemActive = function (index) {};

  // 渲染视图
  Swipe.prototype.render = function () {
    this.el.append(this.renderSwiper());
  };

  Swipe.prototype.renderSwiper = function () {
    const div = document.createElement('div');
    addClass(div, 'nalu-swipe');
    const ul = document.createElement('ul');

    const { data } = this.options;
    const result = data.map((item, index) => {
      return this.renderSwiperItem(item, index)
    });
    ul.append(...result);
    div.append(ul);

    this.refs.swipe = div;
    return div
  };

  Swipe.prototype.renderSwiperItem = function (data, index) {
    const { swipeStore } = this;
    const swipeItem = new SwipeItem({ ...data, index, swipeStore });
    return swipeItem.init()
  };

  Swipe.prototype.bind = function () {
    return this
  };

  Swipe.prototype.addItem = function (item) {
    this.items.push(item);
  };

  //复位滑动状态
  Swipe.prototype.restSlide = function () {
    let swiperItems = document.querySelectorAll('.swipe-item');
    // 复位
    for (let i = 0; i < swiperItems.length; i++) {
      swiperItems[i].dataset.type = 0;
    }
  };

  return Swipe;

}));
//# sourceMappingURL=swipe.js.map

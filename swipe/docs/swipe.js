(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swipe = factory());
})(this, (function () { 'use strict';

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

  const STATE_SHRINK = 0;

  /**
   * {item, btns, index, autoShrink}
   * @param {*}
   */
  function SwipeItem(options) {
    this.options = extend({}, this.constructor.defaultOptions, options);
    this.x = 0; // 用来记录滑动偏移的量
    this.state = STATE_SHRINK; // 用来记录状态，默认是缩起，
    // this.swipe.addItem(this) // 调用父组件的 addItem 方法把自身实例 push 到父组件的 this.items 数组里收集起来
    this.refs = {};
  }

  SwipeItem.defaultOptions = {};

  SwipeItem.prototype.init = function () {
    this.refs.swipeItem = this.render();
    return this.refs.swipeItem
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
    ul.append(...btnNodes);

    return ul
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
    this.render();
    this.bind();
    return this
  };

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
    const swipeItem = new SwipeItem({ ...data, index });
    return swipeItem.init()
  };

  Swipe.prototype.bind = function () {
    this.refs.swipe.addEventListener(
      'touchstart',
      this.onTouchStart.bind(this),
      false
    );
    this.refs.swipe.addEventListener(
      'touchmove',
      this.onTouchMove.bind(this),
      false
    );
    this.refs.swipe.addEventListener(
      'touchend',
      this.onTouchEnd.bind(this),
      false
    );
    return this
  };

  Swipe.prototype.unbind = function () {};

  Swipe.prototype.destroy = function () {
    this.unbind();
    return this
  };

  Swipe.prototype.getTouchTarget = function (e) {
    let target = e.target;
    while (target && !target.classList.contains('swipe-item')) {
      target = target.parentElement;
    }
    return target
  };

  Swipe.prototype.onTouchStart = function (e) {
    const target = this.getTouchTarget(e);
    if (!target.classList.contains('swipe-item')) return

    const point = e.touches[0];
    this.startX = point.pageX;
  };

  Swipe.prototype.onTouchMove = function (e) {
    // e.preventDefault()
    // const target = this.getTouchTarget(e)
    // if (!target.classList.contains('swipe-item')) return
    // const point = e.touches[0]
    // this.endX = point.pageX
    // const deltaX = this.startX - this.endX
    // setStyle(target, { transform: `translate3d(${-deltaX}px, 0, 0)` })
  };

  Swipe.prototype.onTouchEnd = function (e) {
    const target = this.getTouchTarget(e);
    if (!target.classList.contains('swipe-item')) return

    const point = e.changedTouches[0];
    this.endX = point.pageX;
    const delatX = this.startX - this.endX;
    // 左滑
    if (target.dataset.type == 0 && delatX > 30) {
      this.restSlide();
      target.dataset.type = 1;
    }
    // 右滑
    if (target.dataset.type == 1 && delatX < -30) {
      this.restSlide();
      target.dataset.type = 0;
    }
    this.startX = 0;
    this.endX = 0;
  };

  Swipe.prototype._translate = function () {};

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

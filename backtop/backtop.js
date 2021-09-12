(function (GLOBAL) {
  function BackTop(el, options = {}) {
    this.el = el;
    this.options = options;
    this.init();
    return this;
  }

  BackTop.prototype.init = function () {
    this.bind();
    return this;
  };

  BackTop.prototype.bind = function () {
    // 监听当前文档的滚动状态
    window.addEventListener("scroll", this.onScroll.bind(this), false);
    // 初始化 backTop scroll 状态
    this.onScroll();
    // 给当前元素绑定点击事件
    this.el.addEventListener("click", this.onClick.bind(this), false);
    return this;
  };

  BackTop.prototype.unbind = function () {
    window.removeEventListener("scroll", this.onScroll.bind(this), false);
    this.el.removeEventListener("click", this.onClick.bind(this), false);
  };

  BackTop.prototype.destroy = function () {
    this.unbind();
    return this;
  };

  BackTop.prototype.onScroll = function () {
    // console.log("window.pageYOffset", window.pageYOffset);
    // 显示/隐藏 backTop 元素
    if (window.pageYOffset < 50) {
      // addClass()
      this.el.classList.add("hidden");
    } else {
      // removeClass()
      this.el.classList.remove("hidden");
    }
  };

  BackTop.prototype.onClick = function () {
    window.scrollTo(0, 0);
  };

  //AMD.
  if (typeof define === "function" && define.amd) {
    define(function () {
      return BackTop;
    });

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = BackTop;

    //Browser.
  } else {
    GLOBAL.BackTop = BackTop;
  }
})(this);

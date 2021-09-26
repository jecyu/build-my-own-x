(function (GLOBAL) {
  const util = {
    extend(target) {
      for (let i = 1, len = arguments.length; i < len; i++) {
        for (let prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop];
          }
        }
      }
      return target;
    },
    addClass(el, className) {
      if (el.classList) {
        el.classList.add(className);
      } else {
        if (!util.hasClass(el, className)) {
          el.className = `${el.className} ${className}`;
        }
      }
    },
    hasClass(el, className) {
      if (el.classList) {
        return el.classList.contains(className);
      }
      const originClass = el.className;
      return ` ${originClass} `.indexOf(` ${className} `) > -1;
    },
  };

  function Tree(el, options) {
    this.el = el;
    this.options = util.extend({}, this.constructor.defaultOptions, options);
    this.init();
    return this;
  }

  Tree.defaultOptions = {};

  Tree.prototype.init = function () {
    this.render();
    return this;
  };

  // 渲染视图
  Tree.prototype.render = function () {
    this.el.append(this.renderTree(this.options.data));
  };

  // 渲染树组件
  Tree.prototype.renderTree = function (data) {
    const Tree = document.createElement('ul');
    let result = [];
    for (let i = 0; i < data.length; i++) { // 多层嵌套渲染
      if (!data[i].children) {
        result.push(this.renderTreeNode(data[i]));
      } else {
        const treeNode = this.renderTreeNode(data[i]);
        treeNode.append(this.renderTree(data[i].children)); // 深度渲染孩子节点
        result.push(treeNode);
      }
    }
    Tree.append(...result);
    util.addClass(Tree, 'naui-tree');
    return Tree;
  };

  // 渲染树节点组件
  Tree.prototype.renderTreeNode = function (data) {
    let Node = document.createElement('li');
    Node.innerHTML = data.label; // tree node
    return Node;
  };

  Tree.prototype.bind = function () {
    return this;
  };

  Tree.prototype.unbind = function () {};

  Tree.prototype.destroy = function () {
    this.unbind();
    return this;
  };

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Tree;
    });

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tree;

    //Browser.
  } else {
    GLOBAL.Tree = Tree;
  }
})(this);

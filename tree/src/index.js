;(function (GLOBAL) {
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
    },
    // 忽略对象的某个 key
    omit(obj, key) {
      return Object.entries(obj)
        .filter((item) => item[0] !== key)
        .reduce((acc, item) => {
          return Object.assign({}, acc, { [item[0]]: item[1] })
        }, {})
    },

    // 扁平化树数据
    flatten(tree, key = 'children') {
      return tree.reduce((acc, item) => {
        if (!item[key]) {
          // 最基本问题
          return acc.concat(item)
        } else {
          return acc.concat(item, util.flatten(item[key], key)) // 基本问题，递归
        }
      }, [])
    },
  }

  function Tree(el, options) {
    this.el = el
    this.options = util.extend({}, this.constructor.defaultOptions, options)
    this.init()
    return this
  }

  Tree.defaultOptions = {}

  Tree.prototype.init = function () {
    this.render()
    return this
  }

  // 渲染视图
  Tree.prototype.render = function () {
    const div = document.createElement('div')
    util.addClass(div, 'naui-tree')
    // div.append(this.renderTree(this.options.data))
    div.append(...this.renderTreeFlatten(this.options.data))
    this.el.append(div)
  }

  // 渲染树组件，扁平化渲染，为虚拟化列表技术使用基础
  Tree.prototype.renderTreeFlatten = function (data) {
    const flatData = util.flatten(data)
    return flatData.map((item) => {
      return this.renderTreeNode(item)
    })
  }

  // 渲染树组件，直接渲染
  Tree.prototype.renderTree = function (data) {
    const Tree = document.createElement('div')
    let result = []
    for (let i = 0; i < data.length; i++) {
      // 多层嵌套渲染
      if (!data[i].children) {
        result.push(this.renderTreeNode(data[i]))
      } else {
        const treeNode = this.renderTreeNode(data[i])
        treeNode.append(this.renderTree(data[i].children)) // 深度渲染孩子节点
        result.push(treeNode)
      }
    }
    Tree.append(...result)
    return Tree
  }

  // Icon + title
  Tree.prototype.renderSelector = function (data) {
    // icon
    const icon = document.createElement('i')
    icon.setAttribute('data-icon', data.children ? 'open' : null)
    // title
    const title = document.createTextNode(data.label)

    const selector = document.createElement('span')
    selector.append(icon, title)
    return selector
  }

  // 渲染树节点组件
  Tree.prototype.renderTreeNode = function (data) {
    let Node = document.createElement('div')
    Node.append(this.renderSelector(data))
    // 处理层级缩进, TODO 后续自动计算
    util.setStyle(Node, { paddingLeft: `${18 * data.level - 1}px` })
    return Node
  }

  Tree.prototype.bind = function () {
    return this
  }

  Tree.prototype.unbind = function () {}

  Tree.prototype.destroy = function () {
    this.unbind()
    return this
  }

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Tree
    })

    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tree

    //Browser.
  } else {
    GLOBAL.Tree = Tree
  }
})(this)

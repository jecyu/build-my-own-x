export function extend(target) {
  for (let i = 1, len = arguments.length; i < len; i++) {
    for (let prop in arguments[i]) {
      if (arguments[i].hasOwnProperty(prop)) {
        target[prop] = arguments[i][prop]
      }
    }
  }
  return target
}

export function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className)
  } else {
    if (!util.hasClass(el, className)) {
      el.className = `${el.className} ${className}`
    }
  }
}

export function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className)
  }
  const originClass = el.className
  return ` ${originClass} `.indexOf(` ${className} `) > -1
}

export function setStyle(element, style) {
  const oldStyle = {}

  const styleKeys = Object.keys(style)

  styleKeys.forEach((key) => {
    oldStyle[key] = element.style[key]
  })

  styleKeys.forEach((key) => {
    element.style[key] = style[key]
  })

  return oldStyle
}

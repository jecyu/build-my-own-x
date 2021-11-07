;(function () {
  function supportsPointerEvents() {
    const dummy = document.createElement('_')
    if (!('pointerEvents' in dummy.style)) return false

    dummy.style.pointerEvents = 'auto'
    dummy.style.pointerEvents = 'x' // 如果支持 pointerEvents 的话，设置为 'x' 是不生效的
    document.body.appendChild(dummy)
    const r = getComputedStyle(dummy).pointerEvents === 'auto'
    document.body.removeChild(dummy)
    return r
  }

  function noPointerEvents(element) {
    // TODO 代理所有的鼠标事件
    element.addEventListener('click', function (evt) {
      this.style.display = 'none'
      const x = evt.pageX,
        y = evt.pageY,
        under = document.elementFromPoint(x, y)
      this.style.display = ''
      evt.stopPropagation()
      evt.preventDefault()
      const target = {}
      for (const prop in evt) {
        target[prop] = evt[prop]
      }
      under.dispatchEvent(new MouseEvent(evt.type, target))
    })
  }

  const wm = document.querySelector('.__wm')
  if (wm && !noPointerEvents) {
    noPointerEvents(wm)
  }
})()

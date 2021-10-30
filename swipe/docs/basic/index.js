const container = document.querySelector('#container')
const data = []

for (let i = 0; i < 100; i++) {
  const obj = {
    item: {
      text: '测试' + i,
      value: i
    },
    btns: [
      {
        action: 'clear',
        text: '不显示',
        color: '#f8cd5e'
      },
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd'
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32'
      }
    ]
  }
  data.push(obj)
}

new Swipe(container, { data })

const container = document.querySelector('#container')
const data = [
  {
    item: {
      text: '测试1',
      value: 1,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试2',
      value: 2,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试3',
      value: 3,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 4,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 5,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 6,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 7,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 8,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 9,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 10,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 11,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 12,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 13,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 14,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 15,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 16,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 17,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 18,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 19,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 20,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 21,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 22,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 23,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
  {
    item: {
      text: '测试',
      value: 24,
    },
    btns: [
      {
        action: 'clear',
        text: '不再关注',
        color: '#c8c7cd',
      },
      {
        action: 'delete',
        text: '删除',
        color: '#ff3a32',
      },
    ],
  },
]

new Swipe(container, { data })

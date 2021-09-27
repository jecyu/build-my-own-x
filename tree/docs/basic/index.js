const container = document.querySelector('#tree');
const data = [
  {
    label: 'node-1',
    children: [
      {
        label: '一级 1',
        level: 1,
        children: [
          {
            label: '二级 1-1',
            level: 2,
            children: [
              {
                label: '三级 1-1-1',
                level: 3,
              },
            ],
          },
        ],
      },
      {
        label: '一级 2',
        level: 1,
        children: [
          {
            label: '二级 2-1',
            level: 2,
            children: [
              {
                label: '三级 2-1-1',
                level: 3,
              },
            ],
          },
          {
            label: '二级 2-2',
            level: 2,
            children: [
              {
                label: '三级 2-2-1',
                level: 3,
              },
            ],
          },
        ],
      },
      {
        label: '一级 3',
        level: 1,
        children: [
          {
            label: '二级 3-1',
            level: 2,
            children: [
              {
                label: '三级 3-1-1',
                level: 3,
              },
            ],
          },
          {
            label: '二级 3-2',
            level: 2,
            children: [
              {
                label: '三级 3-2-1',
                level: 3,
              },
            ],
          },
        ],
      },
      {
        label: '一级 4',
        level: 1,
      },
    ],
  },
  {
    label: 'node-2',
  },
];
const tree = new Tree(container, { data });

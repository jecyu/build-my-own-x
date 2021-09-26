const container = document.querySelector('#tree');
const data = [
  {
    label: 'node-1',
    children: [
      {
        label: 'node-11',
        children: [{ label: 'node-111' }, { label: 'node-112' }],
      },
      {
        label: 'node-12',
        children: [
          { label: 'node-121' },
          { label: 'node-122' },
          { label: 'node-123' },
        ],
      },
    ],
  },
  {
    label: 'node-2',
  },
];
const tree = new Tree(container, { data });

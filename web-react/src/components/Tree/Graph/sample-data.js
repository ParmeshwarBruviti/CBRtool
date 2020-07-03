var nodes = [
  {
    data: {
      id: '3',
      name: '3',
      weight: 180,
      height: 80,
    },
    position: {
      x: 455.13807437348714,
      y: 288.1409566840048,
    },
    group: 'nodes',
    removed: false,
    selected: false,
    selectable: true,
    locked: false,
    grabbable: true,
    classes: '',
  },
  {
    data: {
      id: '6',
      name: '6',
      weight: 100,
      height: 80,
    },
    position: {
      x: 517.5,
      y: 186.62435565298256,
    },
    group: 'nodes',
    removed: false,
    selected: false,
    selectable: true,
    locked: false,
    grabbable: true,
    classes: '',
  },
  {
    data: {
      id: '8',
      name: '8',
      weight: 80,
      height: 80,
    },
    position: {
      x: 537.8619256265129,
      y: 288.1409566840057,
    },
    group: 'nodes',
    removed: false,
    selected: false,
    selectable: true,
    locked: false,
    grabbable: true,
    classes: '',
  },
]

var edges = [
  {
    data: {
      id: '30',
      source: '6',
      target: '3',
      social: true,
      weight: 80,
    },
    position: {},
    group: 'edges',
    removed: false,
    selected: false,
    selectable: true,
    locked: false,
    grabbable: true,
    classes: '',
  },
  {
    data: {
      id: '32',
      source: '6',
      target: '8',
      social: true,
      weight: 80,
    },
    position: {},
    group: 'edges',
    removed: false,
    selected: false,
    selectable: true,
    locked: false,
    grabbable: true,
    classes: '',
  },
  {
    data: {
      id: '45',
      source: '8',
      target: '3',
      social: true,
      weight: 180,
    },
    position: {},
    group: 'edges',
    removed: false,
    selected: false,
    selectable: true,
    locked: false,
    grabbable: true,
    classes: '',
  },
]

module.exports = {
  nodes,
  edges,
}

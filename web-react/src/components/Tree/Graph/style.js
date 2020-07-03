export default [
  {
    selector: 'node',
    style: {
      label: 'data(name)',
      'font-family': 'helvetica',
      'font-size': '14px',
      'text-outline-width': '3px',
      'text-outline-color': 'rgb(153,153,153)',
      'text-valign': 'center',
      color: 'rgb(255,255,255)',
      width: 'mapData(weight, 30, 80, 20, 50)',
      height: 'mapData(height, 0, 200, 10, 45)',
      'border-color': 'rgb(255,255,255)',
    },
  },
  {
    selector: ':selected',
    style: {
      'background-color': 'rgb(0,0,0)',
      'line-color': 'rgb(0,0,0)',
      'target-arrow-color': 'rgb(0,0,0)',
      'text-outline-color': 'rgb(0,0,0)',
    },
  },
  {
    selector: 'edge',
    style: {
      width: '2px',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'node.highlighted',
    style: {
      'background-color': 'rgb(0,0,0)',
      'text-outline-color': 'rgb(0,0,0)',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
    },
  },
  {
    selector: 'node.start',
    style: {
      'target-arrow-color': '#8FDC97',
    },
  },
  {
    selector: 'node.end',
    style: {
      'target-arrow-color': '#9F4A54',
    },
  },
  {
    selector: 'edge.highlighted',
    style: {
      'line-color': '#008484',
      width: '5px',
    },
  },
]

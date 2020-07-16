export default [
  {
    selector: 'node',
    style: {
      label: 'data(id)',
      'font-family': 'Arial',
      'font-weight': 'bold',
      'font-size': '5.2em',

      color: 'rgb(255,255,255)',
      'background-color': 'data(color)',

      'text-valign': 'center',
      'text-wrap': 'ellipsis',
      'text-max-width': '290px',

      width: '320px',
      height: '320px',
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
      width: '7px',

      'arrow-scale': '2',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
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

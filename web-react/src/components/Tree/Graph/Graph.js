import React, { useEffect, useState } from 'react'

import CytoscapeComponent from 'react-cytoscapejs'

import style from './style'

import { nodes, edges } from './sample-data'

function Graph(props) {
  const [coreCy, setCoreCy] = useState(null)

  useEffect(() => {
    const cy = coreCy
    console.log(coreCy)
    if (cy) {
      cy.on('click', 'node', (e) => {
        const node = e.target.id()
        console.log('clicked : ', node)
        // history.push(`/node-details/${node}`);
      })
    }
  })

  const layout = {
    name: 'breadthfirst',
    roots: '#6',
  }

  const data = [...nodes, ...edges]

  return (
    <CytoscapeComponent
      cy={(cy) => {
        setCoreCy(cy)
      }}
      className={`graph ${props.className}`}
      elements={CytoscapeComponent.normalizeElements(data)}
      stylesheet={style}
      layout={layout}
    />
  )
}

export default Graph

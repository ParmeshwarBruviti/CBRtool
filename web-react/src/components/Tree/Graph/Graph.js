import React, { useEffect, useState } from 'react'

import CytoscapeComponent from 'react-cytoscapejs'

import style from './style'

function Graph(props) {
  const [coreCy, setCoreCy] = useState(null)

  useEffect(() => {
    const cy = coreCy
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
    roots: `#${props.startNodeId}`,

  }

  const data = [...props.nodes, ...props.edges]

  console.log('Graph Data: ', data)

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

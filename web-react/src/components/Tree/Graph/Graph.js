import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import CytoscapeComponent from 'react-cytoscapejs'

import style from './style'

function Graph(props) {
  const [coreCy, setCoreCy] = useState(null),
    history = useHistory()

  useEffect(() => {
    const cy = coreCy

    if (cy) {
      cy.on('click tap', 'node', (e) => {
        const node = e.target.id()
        const details = props.nodes.find((n) => n.data.id === node)

        history.push(
          `/tree/view-node/${(
            details.data.type || 'na'
          ).toLowerCase()}/${node}`,
          {
            isDrawerOpen: true,
            // data: details
          }
        )
      })

      cy.on('click tap', 'edge', (e) => {
        const edge = e.target.json().data

        history.push(
          `/tree/view-edge/${(edge.type || 'na').toLowerCase()}/${edge.id}`,
          {
            isDrawerOpen: true,
            // data: details
          }
        )
      })
    }
  }, [coreCy])

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

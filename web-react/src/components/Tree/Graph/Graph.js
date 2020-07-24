import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import CytoscapeComponent from 'react-cytoscapejs'

import style from './style'

function Graph(props) {
  const history = useHistory()
  const [layout, setLayout] = useState({
    name: 'breadthfirst',
    roots: `#${props.startNodeId}`,
    padding: 80,
    directed: true,
    circle: false,
    fit: true,
    grid: false,
    avoidOverlap: true,
    zoom: 0.09,
    spacingFactor: 3.3,
  })
  const [className, setClassName] = useState('')

  let coreCy = null

  useEffect(() => {
    const cy = coreCy

    if (cy) {
      cy.resize()
      cy.on('click tap', 'node', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const node = e.target.id()
        const nodeDetails = props.nodes.find((n) => n.data.id === node)
        if (nodeDetails) {
          history.push(
            `/tree/view-node/${nodeDetails.data.type.toLowerCase()}/${node}`,
            {
              isDrawerOpen: true,
              // data: details
            }
          )
        } else {
          console.log('Not Found : ', nodeDetails)
        }
      })

      cy.on('click tap', 'edge', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const edge = e.target.json().data
        if (edge) {
          history.push(
            `/tree/view-edge/${(edge.type || 'na').toLowerCase()}/${edge.id}`,
            {
              isDrawerOpen: true,
              // data: details
            }
          )
        } else {
          console.log('Not Found : ', edge)
        }
      })

      // /*
      // Cursor Pointer
      cy.on('mouseover', 'node, edge', function (e) {
        e.preventDefault()
        e.stopPropagation()
        setClassName('mouseover')
      })

      cy.on('mouseout', 'node, edge', function (e) {
        e.preventDefault()
        e.stopPropagation()
        setClassName('')
      })
      // */
    }
  }, [props.nodes.length, props.edges.length])

  useEffect(() => {
    if (props.settings.layout === 'Circular') {
      setLayout({
        ...layout,
        circle: true,
        zoom: 0.03,
      })
    } else if (props.settings.layout === 'Breath First Search') {
      setLayout({
        ...layout,
        circle: false,
        zoom: 0.09,
      })
    }
  }, [props.settings])

  return (
    <CytoscapeComponent
      cy={(cy) => {
        coreCy = cy
      }}
      className={`graph ${props.className} ${className}`}
      elements={CytoscapeComponent.normalizeElements([
        ...props.nodes,
        ...props.edges,
      ])}
      stylesheet={style}
      layout={layout}
    />
  )
}

export default Graph

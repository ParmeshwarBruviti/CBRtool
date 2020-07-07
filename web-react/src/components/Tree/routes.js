import React from 'react'

import AddNode from './Graph/Node/AddNode'
import AddEdge from './Graph/Edge/AddEdge'

function DefaultSection() {
  return <h2>Please select Node/Edge</h2>
}

const routes = [
  {
    path: '/',
    component: DefaultSection,
    exact: true,
  },
  {
    path: '/add-node',
    component: AddNode,
    exact: true,
  },
  {
    path: '/add-edge',
    component: AddEdge,
    exact: true,
  },
]

function getRoutes(url) {
  return routes.map((r) => {
    r.path = url + r.path
    return r
  })
}

export default getRoutes

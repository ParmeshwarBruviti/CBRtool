import React from 'react'

import AddNode from './Graph/Node/AddNode'
import ViewNode from './Graph/Node/ViewNode'

import AddEdge from './Graph/Edge/AddEdge'

function DefaultSection() {
  return <h2>Please select Node/Edge</h2>
}

const routes = [
  {
    path: '/tree',
    component: DefaultSection,
    exact: true,
  },
  {
    path: '/tree/add-node',
    component: AddNode,
    exact: true,
  },
  {
    path: '/tree/view-node/:type/:id',
    component: ViewNode,
    exact: true,
  },
  {
    path: '/tree/add-edge',
    component: AddEdge,
    exact: true,
  },
]

export default routes

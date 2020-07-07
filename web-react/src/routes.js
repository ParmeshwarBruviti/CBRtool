import React from 'react'
import { AccountTree as TreeIcon } from '@material-ui/icons'

import TreeView from './components/Tree/view'

function ErrorView() {
  return <div>Page Not Found</div>
}

const routes = [
  {
    path: '/tree',
    component: TreeView,
    exact: false,
    icon: TreeIcon,
    name: 'Tree',
    // auth: false
  },
  {
    path: '*',
    component: ErrorView,
    exact: false,
    name: 'Page Not Found',
  },
]

export default routes

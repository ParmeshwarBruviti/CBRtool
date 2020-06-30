import { AccountTree as TreeIcon } from '@material-ui/icons'

import TreeView from './components/Tree/tree-view'

const routes = [
  {
    path: '/',
    component: TreeView,
    exact: true,
    icon: TreeIcon,
    name: 'Tree',
    // auth: false
  },
]

export default routes

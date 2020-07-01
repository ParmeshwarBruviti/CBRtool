import { AccountTree as TreeIcon } from '@material-ui/icons'

import TreeView from './components/Tree/view'

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

import React, { useEffect, useState } from 'react'

import { Switch, Route, useHistory } from 'react-router-dom'

import Graph from './Graph/Graph'
import routes from './routes'

import { SwipeableDrawer, IconButton, Menu, MenuItem } from '@material-ui/core'

import { AddCircleOutline as AddIcon } from '@material-ui/icons'

// import { nodes, edges } from './Graph/sample-data'

import { GET_ALL_NODES_EDGES } from '../../queries/custom-queries'
import { useQuery } from '@apollo/react-hooks'

const options = ['Add Node', 'Add Edge']

const ITEM_HEIGHT = 48

function SubMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const selectMenu = (type) => {
    setAnchorEl(null)
    props.selectedMenu(true, type)
  }

  return (
    <div className={props.className}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        size="medium"
        onClick={handleClick}
      >
        <AddIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              selectMenu(option)
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

function TreeView() {
  const history = useHistory()
  const [isDrawerOpen, setDrwaerState] = React.useState(false)

  const { loading, error, data } = useQuery(GET_ALL_NODES_EDGES)

  useEffect(() => {
    const {
      location: { state, pathname },
    } = history
    if (pathname.indexOf('/tree') > -1) {
      if (state !== undefined && state.isDrawerOpen !== undefined) {
        setDrwaerState(state.isDrawerOpen)
      }
    }
  }, [history.location.pathname])

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setDrwaerState(open)

    if (!open) {
      history.push('/tree')
    }
  }

  const selectedMenu = (open, type) => {
    setDrwaerState(open)
    if (type === 'Add Node') {
      history.push('/tree/add-node', {
        start: !(nodes.length || 0),
      })
    } else if (type === 'Add Edge') {
      history.push('/tree/add-edge')
    }
  }

  const processDataForGraph = () => {
    let startNodeId = ''
    if (data) {
      const {
        getAllInOne: { questions, solutions, questionEdges, solutionEdges },
      } = data

      return {
        nodes: [
          ...(questions
            ? questions.map((q) => {
                if (q.start) {
                  startNodeId = q.questionId
                }
                const data = {
                  id: q.questionId,
                  name: q.raw_content,
                  type: 'Question',
                  color: '#eb7abf',
                  properties: {
                    ...q,
                  },
                }
                return {
                  data,
                }
              })
            : []),
          ...(solutions
            ? solutions.map((s) => {
                const data = {
                  id: s.solutionId,
                  name: s.raw_content,
                  type: 'Solution',
                  color: '#7acc7a',
                  properties: {
                    ...s,
                  },
                }
                return {
                  data,
                }
              })
            : []),
        ],
        edges: [
          ...(questionEdges
            ? questionEdges.map((qe) => {
                const data = {
                  id: qe.identity,
                  name: qe.identity,
                  type: 'QuestionEdge',
                  // weight: 1,
                  source: qe.from.questionId,
                  target: qe.to.questionId,
                  properties: {
                    ...qe,
                  },
                }
                return {
                  data,
                }
              })
            : []),
          ...(solutionEdges
            ? solutionEdges.map((se) => {
                const data = {
                  id: se.identity,
                  name: se.identity,
                  type: 'SolutionEdge',
                  // weight: 1,
                  source: se.from.questionId,
                  target: se.to.solutionId,
                  properties: {
                    ...se,
                  },
                }

                return {
                  data,
                }
              })
            : []),
        ],
        startNodeId,
      }
    }
    return {}
  }

  const { nodes = [], edges = [], startNodeId = '' } = processDataForGraph()

  return (
    <div className="tree-view">
      {loading ? (
        <div className="view">Loading ...</div>
      ) : error ? (
        <div className="view">Getting Error</div>
      ) : data ? (
        <div className="view">
          <SubMenu className="menu" selectedMenu={selectedMenu} />
          <Graph
            className="right-panel"
            nodes={nodes}
            edges={edges}
            startNodeId={startNodeId}
          />
        </div>
      ) : (
        <div className="view">Empty Data</div>
      )}
      <SwipeableDrawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {
          // setDrwaerState(false);
        }}
        onOpen={toggleDrawer(true)}
      >
        <div className="drawer">
          <Switch>
            {routes.map((route, i) => {
              return <Route key={`route-${i}`} {...route} />
            })}
          </Switch>
        </div>
      </SwipeableDrawer>
    </div>
  )
}

export default TreeView

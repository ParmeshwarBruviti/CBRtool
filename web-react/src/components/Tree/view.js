import React from 'react'
import Graph from './Graph/Graph'

import { SwipeableDrawer, IconButton, Menu, MenuItem } from '@material-ui/core'

import {
  AddCircleOutline as AddIcon,
  Cancel as CancelIcon,
} from '@material-ui/icons'

const options = ['Add Node', 'Add Edge']

const ITEM_HEIGHT = 48

function SubMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)
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
  const [isDrawerOpen, setDrwaerState] = React.useState(false)

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setDrwaerState(open)
  }

  const selectedMenu = (open, type) => {
    console.log('Type : ', type)
    setDrwaerState(open)
  }

  return (
    <div className="tree-view">
      <div className="view">
        <SubMenu className="menu" selectedMenu={selectedMenu} />
        <Graph className="right-panel" />
      </div>
      <SwipeableDrawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div className="drawer">
          <div className="title">
            <h1>Node Details</h1>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => {
                setDrwaerState(false)
              }}
            >
              <CancelIcon />
            </IconButton>
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  )
}

export default TreeView

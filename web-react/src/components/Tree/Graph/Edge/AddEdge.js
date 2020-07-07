import React from 'react'

import { useHistory } from 'react-router-dom'

import { IconButton } from '@material-ui/core'

import { Cancel as CancelIcon } from '@material-ui/icons'

function AddEdge() {
  const history = useHistory()
  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>Add Edge</span>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            size="small"
            onClick={() => {
              history.push('/tree', { isDrawerOpen: false })
            }}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <div className="drawer-content">
        <div>Add Edge fields</div>
      </div>
      <div className="drawer-footer"></div>
    </div>
  )
}

export default AddEdge

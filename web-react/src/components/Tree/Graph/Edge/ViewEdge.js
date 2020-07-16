import React from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { IconButton } from '@material-ui/core'
import { Cancel as CancelIcon } from '@material-ui/icons'

import { useQuery } from '@apollo/react-hooks'
import { GET_EDGE } from '../../../../queries/edge-queries'

function Attribute(props) {
  const { label, value } = props
  return (
    <div className="row">
      <label>{label}</label>
      <span className={`value${value.length === 0 ? ' empty' : ''}`}>
        {value.length > 0 ? value : '-'}
      </span>
    </div>
  )
}

function ViewEdge() {
  const params = useParams()
  const history = useHistory()
  const { type = 'edge', _id } = params

  const keyMapping = {
    _id: 'Answer Id',
    type: 'Type',
    start: 'Start',
    end: 'End',
    synonyms: 'Synonyms',
    value: 'Value',
    raw_content: 'Raw Content',
    source_ref: 'Source Ref',
  }

  const { loading, error, data } = useQuery(GET_EDGE, {
    variables: {
      _id,
    },
  })

  const transformData = () => {
    if (!data) {
      return
    } else {
      if (data.Edge) {
        const resp = data.Edge[0]
        return Object.keys(resp).reduce(
          (accumulator, currentValue) => {
            if (!keyMapping[currentValue]) return accumulator
            return [
              ...accumulator,
              {
                label: keyMapping[currentValue],
                value: resp[currentValue],
              },
            ]
          },
          [
            {
              label: 'Type',
              value: type,
            },
          ]
        )
      } else {
        console.log('data not found')
      }
    }
  }

  let details = transformData()

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>View Edge Details</span>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            size="small"
            onClick={() => {
              history.push('/tree', { isDrawerOpen: false })
            }}
          >
            <CancelIcon />
          </IconButton>
        </div>
      </div>
      <div className="drawer-content">
        {loading ? (
          <div>Loading ...</div>
        ) : (
          <div>
            {error ? (
              <div>Getting Error</div>
            ) : (
              <form className="form" autoComplete="off">
                
             {details?.map((d, i) => (
                  <Attribute key={`key-${i}`} label={d.label} value={d.value} />
                ))}
      
              </form>
            )}
          </div>
        )}
      </div>
      <div className="drawer-footer"></div>
    </div>
  )
}

export default ViewEdge

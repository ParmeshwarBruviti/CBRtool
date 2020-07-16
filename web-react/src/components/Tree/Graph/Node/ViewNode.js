import React from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { IconButton } from '@material-ui/core'
import { Cancel as CancelIcon } from '@material-ui/icons'

import { useQuery } from '@apollo/react-hooks'
import { GET_QUESTION, GET_SOLUTION } from '../../../../queries/node-queries'

function Attribute(props) {
  const { label, value } = props
  return (
    <div className="row">
      <label>{label}</label>
      <span className={`value${value?.length === 0 ? ' empty' : ''}`}>
        {  value?.length > 0 ? value : '-'}
      </span>
    </div>
  )
}

function ViewNode() {
  const params = useParams()
  const history = useHistory()
  const { type = 'question', _id } = params

  const keyMapping = {
    type: 'Type',
    raw_content: 'Raw Content',
    hint: 'Hint',
    content: 'Content',
    context: 'Context',
    source_ref: 'Source Ref',
    space: 'Space',
    parts: 'Parts',
    attachment_types: 'Attachment Types',
    attachment_titles: 'Attachment Titles',
    attachment_paths: 'Attachment Paths',
  }

  const { loading, error, data } = useQuery(
    type === 'question' ? GET_QUESTION : GET_SOLUTION,
    {
      variables: {
        _id,
      },
    }
  )

  const transformData = () => {
    if (!data) {
      return
    } else {
      const resp = type === 'question' ? data.Question[0] : data.Solution[0]
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
    }
  }

  let details = transformData()

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>View Node Details</span>
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
                {details.map((d, i) => (
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

export default ViewNode

import React, { useState } from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { IconButton, Button } from '@material-ui/core'
import {
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from '@material-ui/icons'

import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  GET_QUESTION,
  DELETE_QUESTION,
  GET_SOLUTION,
  DELETE_SOLUTION,
  GET_ALL_NODES_EDGES,
} from '../../../../queries'

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

function ViewNode() {
  const [deleted, setDeleted] = useState(false),
    params = useParams(),
    history = useHistory(),
    { type = 'question', id } = params,
    [DeleteQuestion] = useMutation(DELETE_QUESTION),
    [DeleteSolution] = useMutation(DELETE_SOLUTION)

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
        id,
      },
    }
  )

  const transformData = () => {
    if (!data) {
      return
    } else {
      const resp = type === 'question' ? data.Question[0] : data.Solution[0]
      return resp
        ? Object.keys(resp).reduce(
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
        : null
    }
  }

  const deleteNode = () => {
    if (type === 'question') {
      DeleteQuestion({
        variables: {
          id: data.Question[0].questionId,
        },
        refetchQueries: [
          {
            query: GET_ALL_NODES_EDGES,
          },
        ],
      })
        .then((res) => {
          setDeleted(true)
          console.log('Question is Deleted : ', res)
        })
        .catch((err) => {
          console.log('Error While Deleleting Question : ', err)
        })
    } else if (type === 'solution') {
      DeleteSolution({
        variables: {
          id: data.Solution[0].solutionId,
        },
        refetchQueries: [
          {
            query: GET_ALL_NODES_EDGES,
          },
        ],
      })
        .then((res) => {
          setDeleted(true)
          console.log('Solution is Deleted : ', res)
        })
        .catch((err) => {
          console.log('Error While Deleleting Soution : ', err)
        })
    } else {
      console.log('Unknown Type')
    }
  }

  const details = transformData()

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>View Node Details</span>
          <div className="actions">
            {details
              ? [
                  <IconButton
                    key="ico-edit-1"
                    aria-label="Edit"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    color="primary"
                    size="small"
                    onClick={() => {
                      console.log('Edit This')
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>,
                  <IconButton
                    key="ico-delete-2"
                    aria-label="Delete"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    color="secondary"
                    size="small"
                    onClick={() => {
                      deleteNode()
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>,
                ]
              : null}
            <IconButton
              aria-label="Cancel"
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
      </div>
      <div className="drawer-content">
        {deleted ? (
          <div>
            <h5>The {type} is deleted</h5>
            <div>
              <b>Id: </b>
              {type === 'question'
                ? data.Question[0].questionId
                : data.Solution[0].solutionId}
            </div>
            <div>
              <b>Content: </b>
              {type === 'question'
                ? data.Question[0].content
                : data.Solution[0].content}
            </div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DoneIcon />}
              onClick={() => {
                history.push('/tree', { isDrawerOpen: false })
              }}
            >
              Ok
            </Button>
          </div>
        ) : loading ? (
          <div>Loading ...</div>
        ) : error ? (
          <div>Getting Error</div>
        ) : (
          <form className="form" autoComplete="off">
            {details ? (
              details.map((d, i) => (
                <Attribute key={`key-${i}`} label={d.label} value={d.value} />
              ))
            ) : (
              <div>No Data Available for {id}</div>
            )}
          </form>
        )}
      </div>
      <div className="drawer-footer"></div>
    </div>
  )
}

export default ViewNode

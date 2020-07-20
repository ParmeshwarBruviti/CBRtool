import React, { useState, useEffect } from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { IconButton, Button } from '@material-ui/core'
import {
  Cancel as CancelIcon,
  DeleteForever as DeletedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from '@material-ui/icons'

import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_EDGE,
  DELETE_QUE_QUE_EDGE,
  DELETE_QUE_SOL_EDGE,
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

const keyMapping = {
  answerId: 'Answer Id',
  type: 'Type',
  start: 'Start',
  end: 'End',
  synonyms: 'Synonyms',
  value: 'Value',
  raw_content: 'Raw Content',
  source_ref: 'Source Ref',
}

function ViewEdge() {
  const [deleted, setDeleted] = useState(false)
  const [edgeData, setEdgeData] = useState([])
  const params = useParams()
  const history = useHistory()
  const { type = 'edge', id } = params

  const [DeleteQuestionQuestionEdge] = useMutation(DELETE_QUE_QUE_EDGE)
  const [DeleteQuestionSolutionEdge] = useMutation(DELETE_QUE_SOL_EDGE)

  const { loading, error, data } = useQuery(GET_EDGE, {
    variables: {
      id,
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

  const deleteEdge = () => {
    if (type === 'questionedge') {
      DeleteQuestionQuestionEdge({
        variables: {
          fromQuestionId: data.Edge[0].start,
          toQuestionId: data.Edge[0].end,
        },
        refetchQueries: [
          {
            query: GET_ALL_NODES_EDGES,
          },
        ],
      })
        .then((res) => {
          setDeleted(true)
          setEdgeData([])
          console.log('Question is Deleted : ', res)
        })
        .catch((err) => {
          console.log('Error While Deleleting Question : ', err)
        })
    } else if (type === 'solutionedge') {
      DeleteQuestionSolutionEdge({
        variables: {
          fromQuestionId: data.Edge[0].start,
          toSolutionId: data.Edge[0].end,
        },
        refetchQueries: [
          {
            query: GET_ALL_NODES_EDGES,
          },
        ],
      })
        .then((res) => {
          setDeleted(true)
          setEdgeData([])
          console.log('Solution is Deleted : ', res)
        })
        .catch((err) => {
          console.log('Error While Deleleting Soution : ', err)
        })
    } else {
      console.log('Unknown Type')
    }
  }

  useEffect(() => {
    setEdgeData(transformData())
  }, [data])

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>{deleted ? 'Edge Deleted' : 'View Edge Details'}</span>
          <div className="actions">
            {edgeData && edgeData.length > 0
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
                      deleteEdge()
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>,
                ]
              : null}
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
      </div>
      <div className="drawer-content">
        {deleted ? (
          <div className="delete-container">
            <DeletedIcon className="delete-icon" fontSize="large" />
            <span className="delete-msg">
              The {type === 'questionedge' ? 'question edge' : 'solution edge'}{' '}
              is deleted
            </span>
            <div>
              <b>From: </b>
              {data.Edge[0].start}
            </div>
            <div>
              <b>to: </b>
              {data.Edge[0].end}
            </div>
            <div>
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
          </div>
        ) : loading ? (
          <div>Loading ...</div>
        ) : (
          <div>
            {error ? (
              <div>Getting Error</div>
            ) : (
              <form className="form" autoComplete="off">
                {edgeData && edgeData.length ? (
                  edgeData.map((d, i) => (
                    <Attribute
                      key={`key-${i}`}
                      label={d.label}
                      value={d.value}
                    />
                  ))
                ) : (
                  <div>No Data Available for {id}</div>
                )}
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

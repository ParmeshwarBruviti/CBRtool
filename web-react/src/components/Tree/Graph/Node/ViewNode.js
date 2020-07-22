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

const keyMapping = {
  type: {
    label: 'Type',
    index: 1,
  },
  id: {
    index: 0,
  },
  raw_content: {
    label: 'Raw Content',
    index: 2,
  },
  hint: {
    label: 'Hint',
    index: 3,
  },
  content: {
    label: 'Content',
    index: 4,
  },
  context: {
    label: 'Context',
    index: 5,
  },
  source_ref: {
    label: 'Source Ref',
    index: 6,
  },
  space: {
    label: 'Space',
    index: 7,
  },
  parts: {
    label: 'Parts',
    index: 8,
  },
  attachment_types: {
    label: 'Attachment Types',
    index: 9,
  },
  attachment_titles: {
    label: 'Attachment Titles',
    index: 10,
  },
  attachment_paths: {
    label: 'Attachment Paths',
    index: 11,
  },
}

function ViewNode() {
  const [deleted, setDeleted] = useState(false),
    [nodeData, setNodeData] = useState([]),
    params = useParams(),
    history = useHistory(),
    { type = 'question', id } = params,
    [DeleteQuestion] = useMutation(DELETE_QUESTION),
    [DeleteSolution] = useMutation(DELETE_SOLUTION)

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
        ? Object.keys(resp)
            .reduce(
              (accumulator, currentValue) => {
                if (!keyMapping[currentValue]) return accumulator
                return [
                  ...accumulator,
                  {
                    label: keyMapping[currentValue].label,
                    index: keyMapping[currentValue].index,
                    value: resp[currentValue],
                  },
                ]
              },
              [
                {
                  label: type === 'question' ? 'Question Id' : 'Solutioin Id',
                  index: keyMapping['id'].index,
                  value: resp.questionId || resp.solutionId,
                },
                {
                  label: 'Type',
                  index: keyMapping['type'].index,
                  value: type,
                },
              ]
            )
            .sort((a, b) => a.index - b.index)
        : []
    }
  }

  const editNode = () => {
    if (type === 'question') {
      history.push(
        `/tree/edit-node/${type.toLowerCase()}/${data.Question[0].questionId}`,
        { isDrawerOpen: true }
      )
    } else if (type === 'solution') {
      history.push(
        `/tree/edit-node/${type.toLowerCase()}/${data.Solution[0].solutionId}`,
        { isDrawerOpen: true }
      )
    } else {
      console.log('Unkonwn type : ', type)
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
          setNodeData([])
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
          setNodeData([])
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
    // const details = transformData()
    setNodeData(transformData())
  }, [data])

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>{deleted ? 'Node Deleted' : 'View Node Details'}</span>
          <div className="actions">
            {nodeData && nodeData.length > 0
              ? [
                  <IconButton
                    key="ico-edit-1"
                    aria-label="Edit"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    color="primary"
                    size="small"
                    onClick={() => {
                      editNode()
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
          <div className="delete-container">
            <DeletedIcon className="delete-icon" fontSize="large" />
            <span className="delete-msg">The {type} is deleted</span>
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
        ) : error ? (
          <div>Getting Error</div>
        ) : (
          <form className="form" autoComplete="off">
            {nodeData && nodeData.length ? (
              nodeData.map((d, i) => (
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

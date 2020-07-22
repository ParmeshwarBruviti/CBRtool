import React, { useState, useEffect } from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { IconButton, Button } from '@material-ui/core'
import { Cancel as CancelIcon, Save as SaveIcon } from '@material-ui/icons'

import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  GET_EDGE,
  GET_IDS_Of_QUESTION_AND_SOLUTION,
  MERGE_QUE_QUE_EDGE_MUTATION,
  MERGE_QUE_SOL_EDGE_MUTATION,
  GET_ALL_NODES_EDGES,
  DELETE_QUE_QUE_EDGE,
  DELETE_QUE_SOL_EDGE,
} from '../../../../queries'

import * as Utility from '../../../../common/utility'

function EditEdge() {
  const history = useHistory()
  const params = useParams()
  const { type = 'toQuestion', id } = params

  const [edgeData, setEdgeData] = useState({
    answerId: '',
    type: type === 'questionedge' ? 'toQuestion' : 'toSolution',
    start: '',
    end: '',
    raw_content: '',
    source_ref: '',
    synonyms: '',
    value: '',
  })

  const { loading: loadingIds, data: IdData } = useQuery(
    GET_IDS_Of_QUESTION_AND_SOLUTION
  )

  const { loading, error, data: edgeDetailsData } = useQuery(GET_EDGE, {
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (edgeDetailsData) {
      const resp = edgeDetailsData.Edge[0]
      const transform = {}
      Object.keys(edgeData).forEach((key) => {
        transform[key] = resp[key] || edgeData[key]
      })
      setEdgeData(transform)
    }
  }, [edgeDetailsData])

  const update = ({ target }) => {
    setEdgeData({ ...edgeData, [target.name]: target.value.trim() })
  }

  const [MergeQuestionQuestion_edges] = useMutation(MERGE_QUE_QUE_EDGE_MUTATION)
  const [MergeQuestionSolution_edges] = useMutation(MERGE_QUE_SOL_EDGE_MUTATION)

  const [DeleteQuestionQuestionEdge] = useMutation(DELETE_QUE_QUE_EDGE)
  const [DeleteQuestionSolutionEdge] = useMutation(DELETE_QUE_SOL_EDGE)

  const mergeToQuestionEdge = () => {
    const params = edgeData
    const data = edgeDetailsData.Edge[0]
    if (data.start !== edgeData.start || data.end !== edgeData.end) {
      params.answerId = Utility.getUUID()
    }
    MergeQuestionQuestion_edges({
      variables: {
        ...params,
      },
      refetchQueries: [
        {
          query: GET_ALL_NODES_EDGES,
        },
        {
          query: GET_EDGE,
          variables: {
            id,
          },
        },
      ],
    })
      .then((res) => {
        if (data.start !== edgeData.start || data.end !== edgeData.end) {
          deleteQuestionEdge(data)
        }
        history.push(`/tree`, { isDrawerOpen: false })
        console.log('Edge is updated : ', res)
      })
      .catch((err) => {
        console.log('Err while adding edge : ', err)
      })
  }

  const mergeToSolutionEdge = () => {
    const { ...params } = edgeData
    const data = edgeDetailsData.Edge[0]
    if (data.start !== edgeData.start || data.end !== edgeData.end) {
      params.answerId = Utility.getUUID()
    }
    MergeQuestionSolution_edges({
      variables: {
        ...params,
      },
      refetchQueries: [
        {
          query: GET_EDGE,
          variables: {
            id,
          },
        },
      ],
    })
      .then((res) => {
        if (data.start !== edgeData.start || data.end !== edgeData.end) {
          deleteSolutionEdge(data)
        }
        history.push(`/tree`, { isDrawerOpen: false })
        console.log('Edge is updated : ', res)
      })
      .catch((err) => {
        console.log('Err while adding edge : ', err)
      })
  }

  const deleteQuestionEdge = (data) => {
    DeleteQuestionQuestionEdge({
      variables: {
        fromQuestionId: data.start,
        toQuestionId: data.end,
      },
      refetchQueries: [
        {
          query: GET_ALL_NODES_EDGES,
        },
      ],
    }).catch((err) => {
      console.log('Error While delete Question while Editing : ', err)
    })
  }

  const deleteSolutionEdge = (data) => {
    DeleteQuestionSolutionEdge({
      variables: {
        fromQuestionId: data.start,
        toSolutionId: data.end,
      },
      refetchQueries: [
        {
          query: GET_ALL_NODES_EDGES,
        },
      ],
    }).catch((err) => {
      console.log('Error While Deleleting Soution while Editing : ', err)
    })
  }

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>Edit Edge Details</span>
          <div className="actions">
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
        {loading ? (
          <div>Loading ...</div>
        ) : error ? (
          <div>Getting Error</div>
        ) : (
          <form className="form" autoComplete="off">
            <div className="row">
              <label>Answer Id</label>
              <input
                id="txId"
                name="Id"
                type="text"
                value={edgeData.answerId}
                disabled={true}
              />
            </div>
            <div className="row">
              <label>Type</label>
              <select
                id="optType"
                name="type"
                defaultValue={edgeData.type}
                onChange={update}
                required
              >
                <option value="">Please Select</option>
                <option value="toQuestion">Question to Question Edge </option>
                <option value="toSolution">Question to Solution Edge </option>
              </select>
            </div>
            <div className="row">
              <label>From Question</label>
              <select
                id="optType"
                name="start"
                value={edgeData.start}
                onChange={update}
                required
              >
                {loadingIds ? (
                  <option>Loading ...</option>
                ) : (
                  [
                    <option value="" key="-1">
                      Please Select
                    </option>,
                    ...IdData.Question.map((q, index) => {
                      return (
                        <option
                          key={index}
                          value={q.questionId.toString().trim()}
                        >
                          {q.questionId}
                        </option>
                      )
                    }),
                  ]
                )}
              </select>
            </div>
            {edgeData.type === 'toSolution' ? (
              <div className="row">
                <label>To Solution</label>
                <select
                  id="optType"
                  name="end"
                  value={edgeData.end}
                  onChange={update}
                  required
                >
                  {loadingIds ? (
                    <option>Loading ...</option>
                  ) : (
                    [
                      <option value="" key="-1">
                        Please Select
                      </option>,
                      ...IdData.Solution.map((s, index) => {
                        return (
                          <option
                            key={index}
                            value={s.solutionId.toString().trim()}
                          >
                            {s.solutionId}
                          </option>
                        )
                      }),
                    ]
                  )}
                </select>
              </div>
            ) : (
              <div className="row">
                <label>To Question</label>
                <select
                  id="optType"
                  name="end"
                  value={edgeData.end}
                  onChange={update}
                  required
                >
                  {loadingIds ? (
                    <option>Loading ...</option>
                  ) : (
                    [
                      <option value="" key="-1">
                        Please Select
                      </option>,
                      ...IdData.Question.map((q, index) => {
                        return (
                          <option
                            key={index}
                            value={q.questionId.toString().trim()}
                          >
                            {q.questionId}
                          </option>
                        )
                      }),
                    ]
                  )}
                </select>
              </div>
            )}
            <div className="row">
              <label>Raw Content</label>
              <input
                id="txtRawContent"
                name="raw_content"
                type="text"
                value={edgeData.raw_content}
                onChange={update}
              />
            </div>
            <div className="row">
              <label>Value</label>
              <input
                id="txtValue"
                name="value"
                value={edgeData.value}
                type="text"
                onChange={update}
              />
            </div>
            <div className="row">
              <label>Synonyms</label>
              <input
                id="txtSynonyms"
                name="synonyms"
                type="text"
                value={edgeData.synonyms}
                onChange={update}
              />
              {/* May content HTML */}
            </div>
            <div className="row">
              <label>Source Ref</label>
              <input
                id="txtSourceRef"
                name="source_ref"
                type="text"
                value={edgeData.source_ref}
                onChange={update}
                required
              />
            </div>
          </form>
        )}
      </div>
      <div className="drawer-footer">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
          onClick={() => {
            if (edgeData.type === 'toQuestion') {
              mergeToQuestionEdge()
            } else {
              mergeToSolutionEdge()
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default EditEdge

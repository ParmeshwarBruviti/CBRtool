import React, { useState, useEffect } from 'react'

import { useParams, useHistory } from 'react-router-dom'

import { IconButton, Button } from '@material-ui/core'
import { Cancel as CancelIcon, Save as SaveIcon } from '@material-ui/icons'

import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  GET_QUESTION,
  GET_SOLUTION,
  UPDATE_QUESTION_MUTATION,
  UPDATE_SOLUTION_MUTATION,
} from '../../../../queries'

function EditNode() {
  const history = useHistory()
  const params = useParams()
  const { type = 'question', id } = params

  const [UpdateQuestion] = useMutation(UPDATE_QUESTION_MUTATION)
  const [UpdateSolution] = useMutation(UPDATE_SOLUTION_MUTATION)

  const [state, setState] = useState({
    type: type,
    id: '',
    raw_content: '',
    hint: '',
    content: '',
    context: '',
    source_ref: '',
    space: '',
    parts: [],
    attachment_types: [],
    attachment_titles: [],
    attachment_paths: [],
  })

  const { loading, error, data } = useQuery(
    type === 'question' ? GET_QUESTION : GET_SOLUTION,
    {
      variables: {
        id,
      },
    }
  )

  useEffect(() => {
    if (data) {
      const resp = type === 'question' ? data.Question[0] : data.Solution[0]
      const transform = {}
      Object.keys(state).forEach((key) => {
        transform[key] = resp[key] || state[key]
      })
      transform.id = resp.questionId || resp.solutionId
      setState(transform)
    }
  }, [data])

  const update = ({ target }) => {
    if (
      [
        'parts',
        'attachment_types',
        'attachment_titles',
        'attachment_paths',
      ].indexOf(target.name) > -1
    ) {
      // const val = target.value.trim().split(',')
      const val = target.value.trim().toString()
      setState({ ...state, [target.name]: val })
    } else {
      setState({ ...state, [target.name]: target.value.trim() })
    }
  }

  const updateQuestion = () => {
    console.log('Update Question')
    var {
      type,
      parts,
      attachment_types,
      attachment_titles,
      attachment_paths,
      ...params
    } = state
    params.questionId = new Date().getTime()
    console.log(
      'Ignoring attributes for Question : ',
      type,
      parts,
      attachment_types,
      attachment_titles,
      attachment_paths
    )
    console.log('Question Details : ', { ...params })
    UpdateQuestion({
      variables: {
        ...params,
      },
      refetchQueries: [
        {
          query: GET_QUESTION,
          variables: {
            id,
          },
        },
      ],
    })
      .then((res) => {
        history.push(`/tree`, { isDrawerOpen: false })
        console.log('Question is update : ', res)
      })
      .catch((err) => {
        console.log('Err while updating question : ', err)
      })
  }

  const updateSolution = () => {
    console.log('Update Solution')
    var { start, type, ...params } = state
    params.solutionId = new Date().getTime()
    console.log('Ignoring attributes for Solution : ', type, start)
    console.log('Solution Details : ', { ...params })
    UpdateSolution({
      variables: {
        ...params,
      },
      refetchQueries: [
        {
          query: GET_SOLUTION,
          variables: {
            id,
          },
        },
      ],
    })
      .then((res) => {
        history.push(`/tree`, { isDrawerOpen: false })
        console.log('Solution is update : ', res)
      })
      .catch((err) => {
        console.log('Err while updating solution : ', err)
      })
  }

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>Edit Node Details</span>
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
              <label>
                {type === 'question' ? 'Question Id' : 'Solutioin Id'}
              </label>
              <input
                id="txId"
                name="Id"
                type="text"
                value={state.id}
                disabled={true}
              />
            </div>
            <div className="row">
              <label>Type</label>
              <select
                id="optType"
                name="type"
                defaultValue={state.type}
                onChange={update}
                required
                disabled={true}
              >
                <option value="">Please Select</option>
                <option value="question">Question</option>
                <option value="solution">Solution</option>
              </select>
            </div>
            <div className="row">
              <label>Raw Content</label>
              <textarea
                id="txtRawContent"
                name="raw_content"
                type="text"
                value={state.raw_content}
                onChange={update}
              />
            </div>
            <div className="row">
              <label>Hint</label>
              <input
                id="txtHint"
                name="hint"
                type="text"
                value={state.hint}
                onChange={update}
              />
            </div>
            <div className="row">
              <label>Content</label>
              <textarea
                id="txtContent"
                name="content"
                type="text"
                value={state.content}
                onChange={update}
              />
            </div>
            <div className="row">
              <label>Context</label>
              <input
                id="txtContext"
                name="context"
                type="text"
                value={state.context}
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
                value={state.source_ref}
                onChange={update}
                required
              />
            </div>
            <div className="row">
              <label>Space</label>
              <input
                id="txtSpace"
                name="space"
                type="text"
                value={state.space}
                onChange={update}
              />
            </div>
            {state.type === 'solution'
              ? [
                  <div key="sol-1" className="row">
                    <label>Parts</label>
                    <input
                      id="txtParts"
                      name="parts"
                      type="text"
                      value={state.parts}
                      onChange={update}
                    />
                  </div>,
                  <div key="sol-2" className="row">
                    <label>Attachment Types</label>
                    <input
                      id="txtAttachmentTypes"
                      name="attachment_types"
                      type="text"
                      value={state.attachment_types}
                      onChange={update}
                    />
                  </div>,
                  <div key="sol-3" className="row">
                    <label>Attachment Titles</label>
                    <input
                      id="txtAttachmentTitles"
                      name="attachment_titles"
                      type="text"
                      value={state.attachment_titles}
                      onChange={update}
                    />
                  </div>,
                  <div key="sol-4" className="row">
                    <label>Attachment Paths</label>
                    <input
                      id="txtAttachmentPaths"
                      name="attachment_paths"
                      type="text"
                      value={state.attachment_paths}
                      onChange={update}
                    />
                  </div>,
                ]
              : null}
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
            if (state.type === 'question') {
              updateQuestion()
            } else if (state.type === 'solution') {
              updateSolution()
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default EditNode

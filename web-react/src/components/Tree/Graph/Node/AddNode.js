import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { IconButton, Button } from '@material-ui/core'

import { Cancel as CancelIcon, PersonAdd } from '@material-ui/icons'

import { useMutation } from '@apollo/react-hooks'

import {
  ADD_QUESTION_MUTATION,
  ADD_SOLUTION_MUTATION,
  GET_ALL_NODES_EDGES,
  GET_IDS_Of_QUESTION_AND_SOLUTION,
} from '../../../../queries'

function AddNode() {
  const history = useHistory()
  const {
    location: {
      state: { start, id, nodeLength },
    },
  } = history
  const [nodeData, setNodeData] = useState({
    start: start,
    type: '',
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

  const [CreateQuestion] = useMutation(ADD_QUESTION_MUTATION)
  const [CreateSolution] = useMutation(ADD_SOLUTION_MUTATION)

  const update = ({ target }) => {
    if (
      [
        'parts',
        'attachment_types',
        'attachment_titles',
        'attachment_paths',
      ].indexOf(target.name) > -1
    ) {
      const val = target.value.split(',')
      setNodeData({ ...nodeData, [target.name]: val })
    } else {
      setNodeData({ ...nodeData, [target.name]: target.value })
    }
  }

  const addQuestion = () => {
    var {
      parts,
      attachment_types,
      attachment_titles,
      attachment_paths,
      ...params
    } = nodeData
    params.questionId = id ? id : new Date().getTime()
    console.log(
      'Ignoring attributes for Question : ',
      parts,
      attachment_types,
      attachment_titles,
      attachment_paths
    )
    console.log('Question Details : ', { ...params })
    CreateQuestion({
      variables: {
        ...params,
      },
      refetchQueries: [
        {
          query: GET_ALL_NODES_EDGES,
        },
        {
          query: GET_IDS_Of_QUESTION_AND_SOLUTION,
        },
      ],
    })
      .then((res) => {
        history.push(`/tree`, { isDrawerOpen: false })
        console.log('Question is added : ', res)
      })
      .catch((err) => {
        console.log('Err while adding question : ', err)
      })
  }

  const addSolution = () => {
    var { start, ...params } = nodeData
    params.solutionId = id ? id : new Date().getTime()
    console.log('Ignoring attributes for Solution : ', start)
    console.log('Solution Details : ', { ...params })
    CreateSolution({
      variables: {
        ...params,
      },
      refetchQueries: [
        {
          query: GET_ALL_NODES_EDGES,
        },
        {
          query: GET_IDS_Of_QUESTION_AND_SOLUTION,
        },
      ],
    })
      .then((res) => {
        history.push(`/tree`, { isDrawerOpen: false })
        console.log('Solution is added : ', res)
      })
      .catch((err) => {
        console.log('Err while adding solution : ', err)
      })
  }

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <div className="title">
          <span>Add Node</span>
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
        <form className="form" autoComplete="off">
          <div className="row">
            <label>Type</label>
            <select id="optType" name="type" onChange={update} required>
              <option value="">Please Select</option>
              <option value="Question">Question</option>
              <option
                value="Solution"
                disabled={nodeLength === 0 ? true : false}
              >
                Solution
              </option>
            </select>
          </div>
          <div className="row">
            <label>Raw Content</label>
            <input
              id="txtRawContent"
              name="raw_content"
              type="text"
              onChange={update}
            />
          </div>
          <div className="row">
            <label>Hint</label>
            <input id="txtHint" name="hint" type="text" onChange={update} />
          </div>
          <div className="row">
            <label>Content</label>
            <input
              id="txtContent"
              name="content"
              type="text"
              onChange={update}
            />
          </div>
          <div className="row">
            <label>Context</label>
            <input
              id="txtContext"
              name="context"
              type="text"
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
              onChange={update}
              required
            />
          </div>
          <div className="row">
            <label>Space</label>
            <input id="txtSpace" name="space" type="text" onChange={update} />
          </div>
          {nodeData.type === 'Solution'
            ? [
                <div key="sol-1" className="row">
                  <label>Parts</label>
                  <input
                    id="txtParts"
                    name="parts"
                    type="text"
                    onChange={update}
                  />
                </div>,
                <div key="sol-2" className="row">
                  <label>Attachment Types</label>
                  <input
                    id="txtAttachmentTypes"
                    name="attachment_types"
                    type="text"
                    onChange={update}
                  />
                </div>,
                <div key="sol-3" className="row">
                  <label>Attachment Titles</label>
                  <input
                    id="txtAttachmentTitles"
                    name="attachment_titles"
                    type="text"
                    onChange={update}
                  />
                </div>,
                <div key="sol-4" className="row">
                  <label>Attachment Paths</label>
                  <input
                    id="txtAttachmentPaths"
                    name="attachment_paths"
                    type="text"
                    onChange={update}
                  />
                </div>,
              ]
            : null}
        </form>
      </div>
      <div className="drawer-footer">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PersonAdd />}
          onClick={() => {
            if (nodeData.type === 'Question') {
              addQuestion()
            } else if (nodeData.type === 'Solution') {
              addSolution()
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

export default AddNode

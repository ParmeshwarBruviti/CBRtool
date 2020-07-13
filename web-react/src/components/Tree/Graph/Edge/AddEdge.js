import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { IconButton, Button } from '@material-ui/core'

import { Cancel as CancelIcon, PersonAdd } from '@material-ui/icons'

import { useQuery } from '@apollo/react-hooks'

import { useMutation } from '@apollo/react-hooks'

import {
  ADD_QUE_QUE_EDGE_MUTATION,
  ADD_QUE_SOL_EDGE_MUTATION,
} from '../../../../queries/edge-queries'

import { GET_ALL_NODES_EDGES } from '../../../../queries/custom-queries'



function AddEdge() {
  const history = useHistory()
  const { loading, error, data } = useQuery(GET_ALL_NODES_EDGES)
  const [state, setState] = useState({
    type: '',
    from: -1,
    to: -1,
    answerId: '',
    end: '',
    raw_content: '',
    source_ref: '',
    start: '',
    synonyms: '',
    value: '',
  })

  const update = ({ target }) => {
    setState({ ...state, [target.name]: target.value.trim() })
  }
  const [AddQuestionQuestionEdge] = useMutation(ADD_QUE_QUE_EDGE_MUTATION)
  const [AddQuestionSolutionEdge] = useMutation(ADD_QUE_SOL_EDGE_MUTATION)

  const addRelationEdge = () => {
    var {
      ...params
    } = state
    params.answerId = new Date().getTime()
  
    console.log('Edge Details : ', { ...params })

    if(state.type === "toQuestion"){
      AddQuestionQuestionEdge({
        variables: {
          ...params,
        },
        refetchQueries: [
          {
            query: GET_ALL_NODES_EDGES,
          },
        ],
      })
        .then((res) => {
          history.push(`/tree`, { isDrawerOpen: false })
          console.log('Edge is added : ', res)
        })
        .catch((err) => {
          console.log('Err while adding edge : ', err)
        })
    }else{
      AddQuestionSolutionEdge({
        variables: {
          ...params,
        },
        refetchQueries: [
          {
            query: GET_ALL_NODES_EDGES,
          },
        ],
      })
        .then((res) => {
          history.push(`/tree`, { isDrawerOpen: false })
          console.log('Edge is added : ', res)
        })
        .catch((err) => {
          console.log('Err while adding edge : ', err)
        })
    }
    
  }



  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

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
        <div>
          <form className="form" autoComplete="off">
            <div className="row">
              <label>Type</label>
              <select id="optType" name="type" onChange={update} required>
                <option value="">Please Select</option>
                <option value="toQuestion">Question to Question Edge </option>
                <option value="toSolution">Question to Solution Edge </option>
              </select>
            </div>
            <div className="row">
              <label>From Question</label>
              <select id="optType" name="from" onChange={update} required>
                <option value="">Please Select</option>
                {
                
                  data?.getAllInOne.questions?.map((q, index) => {
                    return (
                      <option key={index} value={q.questionId}>
                        {' '}
                        {q.questionId}{' '}
                      </option>
                    )
                  })
                }
              </select>
            </div>
            {state.type === 'toSolution'
              ? [
                  <div className="row">
                    <label>To Solution</label>
                    <select id="optType" name="to" onChange={update} required>
                      <option value="">Please Select</option>
                      {
                        (console.log('data is', data),
                        data?.getAllInOne.solutions?.map((s, index) => {
                          return (
                            <option key={index} value={s.solutionId}>
                              {' '}
                              {s.solutionId}{' '}
                            </option>
                          )
                        }))
                      }
                    </select>
                  </div>,
                ]
              : [
                  <div className="row">
                    <label>To Question</label>
                    <select id="optType" name="to" onChange={update} required>
                      <option value="">Please Select</option>
                      {
                        (console.log('data is', data),
                        data?.getAllInOne.questions?.map((q, index) => {
                          return (
                            <option key={index} value={q.questionId}>
                              {' '}
                              {q.questionId}{' '}
                            </option>
                          )
                        }))
                      }
                    </select>
                  </div>,
                ]}
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
              <label>Value</label>
              <input id="txtValue" name="value" type="text" onChange={update} />
            </div>
            <div className="row">
              <label>Synonyms</label>
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
          </form>
        </div>
      </div>
      <div className="drawer-footer">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PersonAdd />}
          onClick={() => {
            addRelationEdge()
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

export default AddEdge

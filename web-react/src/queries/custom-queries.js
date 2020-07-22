import gql from 'graphql-tag'

const GET_ALL_NODES_EDGES = gql`
  {
    getAllInOne
  }
`

const GET_IDS_Of_QUESTION_AND_SOLUTION = gql`
  {
    Question {
      questionId
    }
    Solution {
      solutionId
    }
  }
`

export { GET_ALL_NODES_EDGES, GET_IDS_Of_QUESTION_AND_SOLUTION }

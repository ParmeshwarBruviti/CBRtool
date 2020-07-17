import gql from 'graphql-tag'

const ADD_QUE_QUE_EDGE_MUTATION = gql`
  mutation(
    $answerId: ID!
    $end: ID
    $raw_content: String
    $source_ref: String
    $start: ID
    $synonyms: String
    $value: String
    $from: ID!
    $to: ID!
  ) {
    AddQuestionQuestion_edges(
      data: {
        answerId: $answerId
        end: $end
        raw_content: $raw_content
        source_ref: $source_ref
        start: $start
        synonyms: $synonyms
        value: $value
      }
      from: { questionId: $from }
      to: { questionId: $to }
    ) {
      answerId
    }
  }
`

const ADD_QUE_SOL_EDGE_MUTATION = gql`
  mutation(
    $answerId: ID!
    $end: ID
    $raw_content: String
    $source_ref: String
    $start: ID
    $synonyms: String
    $value: String
    $from: ID!
    $to: ID!
  ) {
    AddQuestionSolution_edges(
      data: {
        answerId: $answerId
        end: $end
        raw_content: $raw_content
        source_ref: $source_ref
        start: $start
        synonyms: $synonyms
        value: $value
      }
      from: { questionId: $from }
      to: { solutionId: $to }
    ) {
      answerId
    }
  }
`

const GET_EDGE = gql`
  query($id: ID!) {
    Edge(answerId: $id) {
      answerId
      end
      start
      raw_content
      source_ref
      synonyms
      value
    }
  }
`

const DELETE_QUE_QUE_EDGE = gql`
  mutation($fromQuestionId: ID!, $toQuestionId: ID!) {
    RemoveQuestionQuestion_edges(
      from: { questionId: $fromQuestionId }
      to: { questionId: $toQuestionId }
    ) {
      from {
        questionId
      }
      to {
        questionId
      }
    }
  }
`

const DELETE_QUE_SOL_EDGE = gql`
  mutation($fromQuestionId: ID!, $toSolutionId: ID!) {
    RemoveQuestionSolution_edges(
      from: { questionId: $fromQuestionId }
      to: { solutionId: $toSolutionId }
    ) {
      from {
        questionId
      }
      to {
        solutionId
      }
    }
  }
`

export {
  GET_EDGE,
  ADD_QUE_QUE_EDGE_MUTATION,
  ADD_QUE_SOL_EDGE_MUTATION,
  DELETE_QUE_QUE_EDGE,
  DELETE_QUE_SOL_EDGE,
}

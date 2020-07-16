import gql from 'graphql-tag'

const ADD_QUE_QUE_EDGE_MUTATION = gql`
  mutation(
    $_id: String!
    $end: String
    $raw_content: String
    $source_ref: String
    $start: String 
    $synonyms: String
    $value: String
    $from: String!
    $to: String!
  ) {
    AddQuestionQuestion_edges(
      data: {
        _id: $_id
        end: $end
        raw_content: $raw_content
        source_ref: $source_ref
        start: $start
        synonyms: $synonyms
        value: $value
      }
      from: { _id: $from }
      to: { _id: $to }
    ) {
      _id
    }
  }
`


const ADD_QUE_SOL_EDGE_MUTATION = gql`
  mutation(
    $_id: String!
    $end: String
    $raw_content: String
    $source_ref: String
    $start: String
    $synonyms: String
    $value: String
    $from: String!
    $to: String!
  ) {
    AddQuestionSolution_edges(
      data: {
        _id: $_id
        end: $end
        raw_content: $raw_content
        source_ref: $source_ref
        start: $start
        synonyms: $synonyms
        value: $value
      }
      from: { _id: $from }
      to: { _id: $to }
    ) {
      _id
    }
  }
`


const GET_EDGE = gql`
query($_id: String!) {
  Edge(_id: $_id) {
    _id
    end
    start
    raw_content
    source_ref
    synonyms
    value
  }
}
`

export { 
  ADD_QUE_QUE_EDGE_MUTATION,
  ADD_QUE_SOL_EDGE_MUTATION,
  GET_EDGE 
  }

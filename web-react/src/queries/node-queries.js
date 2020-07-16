import gql from 'graphql-tag'

const ADD_QUESTION_MUTATION = gql`
  mutation(
    $content: String
    $context: String
    $hint: String
    $raw_content: String
    $source_ref: String
    $space: String
    $start: Boolean
  ) {
    CreateQuestion(
      content: $content
      context: $context
      hint: $hint
      raw_content: $raw_content
      source_ref: $source_ref
      space: $space
      start: $start
    ) {
      _id
    }
  }
`

const ADD_SOLUTION_MUTATION = gql`
  mutation(
    $content: String
    $context: String
    $hint: String
    $raw_content: String
    $source_ref: String
    $space: String
    $parts: [String]
    $attachment_types: [String]
    $attachment_titles: [String]
    $attachment_paths: [String]
  ) {
    CreateSolution(
      content: $content
      context: $context
      hint: $hint
      raw_content: $raw_content
      source_ref: $source_ref
      space: $space
      parts: $parts
      attachment_types: $attachment_types
      attachment_titles: $attachment_titles
      attachment_paths: $attachment_paths
    ) {
      _id
    }
  }
`

const GET_QUESTION = gql`
  query($_id: String!) {
    Question(_id: $_id) {
      _id
      content
      context
      hint
      raw_content
      source_ref
      space
      start
    }
  }
`

const GET_SOLUTION = gql`
  query($_id: String!) {
    Solution(_id: $_id) {
      _id
      content
      context
      hint
      raw_content
      source_ref
      space
      parts
      attachment_types
      attachment_titles
      attachment_paths
    }
  }
`

export {
  ADD_QUESTION_MUTATION,
  ADD_SOLUTION_MUTATION,
  GET_QUESTION,
  GET_SOLUTION,
}

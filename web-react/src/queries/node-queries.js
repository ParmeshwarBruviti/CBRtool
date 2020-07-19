import gql from 'graphql-tag'

const ADD_QUESTION_MUTATION = gql`
  mutation(
    $questionId: ID!
    $content: String
    $context: String
    $hint: String
    $raw_content: String
    $source_ref: String
    $space: String
    $start: Boolean
  ) {
    CreateQuestion(
      questionId: $questionId
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

const UPDATE_QUESTION_MUTATION = gql`
  mutation(
    $id: ID!
    $content: String
    $context: String
    $hint: String
    $raw_content: String
    $source_ref: String
    $space: String
    $start: Boolean
  ) {
    UpdateQuestion(
      questionId: $id
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

const GET_QUESTION = gql`
  query($id: ID!) {
    Question(questionId: $id) {
      _id
      questionId
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

const DELETE_QUESTION = gql`
  mutation($id: ID!) {
    DeleteQuestion(questionId: $id) {
      _id
    }
  }
`

const ADD_SOLUTION_MUTATION = gql`
  mutation(
    $solutionId: ID!
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
      solutionId: $solutionId
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

const UPDATE_SOLUTION_MUTATION = gql`
  mutation(
    $id: ID!
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
    UpdateSolution(
      solutionId: $id
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

const GET_SOLUTION = gql`
  query($id: ID!) {
    Solution(solutionId: $id) {
      _id
      solutionId
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

const DELETE_SOLUTION = gql`
  mutation($id: ID!) {
    DeleteSolution(solutionId: $id) {
      _id
    }
  }
`

export {
  ADD_QUESTION_MUTATION,
  UPDATE_QUESTION_MUTATION,
  GET_QUESTION,
  DELETE_QUESTION,
  ADD_SOLUTION_MUTATION,
  UPDATE_SOLUTION_MUTATION,
  GET_SOLUTION,
  DELETE_SOLUTION,
}

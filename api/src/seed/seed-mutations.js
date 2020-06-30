// const fetch = require('node-fetch')
// const parse = require('csv-parse/lib/sync')
const gql = require('graphql-tag')

const {
  db: { Question, Solution, Answer },
} = require('./data')

export const getSeedMutations = () => {
  const queMutaion = getQuestionsMutations(Question),
    solMutaion = getSolutionsMutations(Solution),
    ansMutation = getAnswersMutations(Answer)

  return [...queMutaion, ...solMutaion, ...ansMutation]
}

const getAnswersMutations = (ansData) => {
  return ansData.map((rec) => {
    const params = {
      identity: rec.identity,
      start: rec.start,
      end: rec.end,
      source_ref: rec.data.source_ref,
      raw_content: rec.data.raw_content,
      value: rec.data.value,
      synonyms: rec.data.synonyms,
    }

    return {
      mutation: gql`
        mutation(
          $identity: ID!
          $start: ID!
          $end: ID!
          $source_ref: String
          $raw_content: String
          $value: String
          $synonyms: String
        ) {
          mergeQuestionAnswer(
            identity: $identity
            start: $start
            end: $end
            source_ref: $source_ref
            raw_content: $raw_content
            value: $value
            synonyms: $synonyms
          ) {
            content
            questionId
          }
        }
      `,
      variables: params,
    }
  })
}

const getSolutionsMutations = (solData) => {
  return solData.map((rec) => {
    return {
      mutation: gql`
        mutation(
          $solutionId: ID!
          $context: String
          $space: String
          $hint: String
          $content: String
          $raw_content: String
          $source_ref: String
          $parts: [String]
          $attachment_types: [String]
          $attachment_titles: [String]
          $attachment_paths: [String]
        ) {
          MergeSolution(
            solutionId: $solutionId
            context: $context
            space: $space
            hint: $hint
            content: $content
            raw_content: $raw_content
            source_ref: $source_ref
            parts: $parts
            attachment_types: $attachment_types
            attachment_titles: $attachment_titles
            attachment_paths: $attachment_paths
          ) {
            solutionId
            _id
          }
        }
      `,
      variables: rec,
    }
  })
}

const getQuestionsMutations = (queData) => {
  return queData.map((rec) => {
    if (!rec.start) rec.start = false
    return {
      mutation: gql`
        mutation(
          $questionId: ID!
          $raw_content: String
          $hint: String
          $start: Boolean
          $context: String
          $source_ref: String
          $space: String
          $content: String
        ) {
          MergeQuestion(
            questionId: $questionId
            raw_content: $raw_content
            hint: $hint
            start: $start
            context: $context
            source_ref: $source_ref
            space: $space
            content: $content
          ) {
            questionId
          }
        }
      `,
      variables: rec,
    }
  })
}

const gql = require('graphql-tag')
import { Questions, Solutions, Answers } from './data'

export const getSeedMutations = async () => {
  const questions = Questions
  const solutions = Solutions
  const answers = Answers
  const mutations = generateNewMutations(questions, solutions, answers)
  return mutations
}

const generateNewMutations = (questions, solutions, answers) => {
  console.log('questions :', questions.length)
  console.log('solutions :', solutions.length)
  console.log('answers :', answers.length)
  const questionMutations = getQuestionMutations(questions)
  const solutionMutations = getSolutionMutation(solutions)
  const answerMutations = getAnswerMutations(answers)
  let allMutations = questionMutations
    .concat(solutionMutations)
    .concat(answerMutations)
  return allMutations
}

const getQuestionMutations = (questions) => {
  return questions.map((que) => {
    let queNode = que.n
    let attributes = queNode.properties
    let questionId = queNode.identity
    let start = attributes.start ? attributes.start : false
    let context = attributes.context ? attributes.context : ''
    let space = attributes.space ? attributes.space : ''
    let hint = attributes.hint ? attributes.hint : ''
    let content = attributes.content ? attributes.content : ''
    let raw_content = attributes.raw_content ? attributes.raw_content : ''
    let source_ref = attributes.source_ref ? attributes.source_ref : ''

    let vars = {
      questionId: questionId,
      start: start,
      context: context,
      space: space,
      hint: hint,
      content: content,
      raw_content: raw_content,
      source_ref: source_ref,
    }

    return {
      mutation: gql`
        mutation mergeQuestions(
          $questionId: ID!
          $start: Boolean
          $context: String
          $space: String
          $hint: String
          $content: String
          $raw_content: String
          $source_ref: String
        ) {
          question: MergeQuestion(
            questionId: $questionId
            start: $start
            context: $context
            space: $space
            hint: $hint
            content: $content
            raw_content: $raw_content
            source_ref: $source_ref
          ) {
            questionId
          }
        }
      `,
      variables: vars,
    }
  })
}

/** 
 * @param {  solutionId: ID!
  context: String
  space: String
  hint: String
  content: String
  raw_content: String
  source_ref: String
  parts: [String]
  attachment_types: [String]
  attachment_titles: [String]
  attachment_paths: [String]} solutions 
 */
const getSolutionMutation = (solutions) => {
  return solutions.map((sol) => {
    let solNode = sol.n
    let attributes = solNode.properties
    let solutionId = solNode.identity
    let context = attributes.context ? attributes.context : ''
    let space = attributes.space ? attributes.space : ''
    let hint = attributes.hint ? attributes.hint : ''
    let content = attributes.content ? attributes.content : ''
    let raw_content = attributes.raw_content ? attributes.raw_content : ''
    let source_ref = attributes.source_ref ? attributes.source_ref : ''
    let parts = attributes.parts ? attributes.parts : []
    let attachment_types = attributes.attachment_types
      ? attributes.attachment_types
      : []
    let attachment_titles = attributes.attachment_titles
      ? attributes.attachment_titles
      : []
    let attachment_paths = attributes.attachment_paths
      ? attributes.attachment_paths
      : []

    let vars = {
      solutionId: solutionId,
      context: context,
      space: space,
      hint: hint,
      content: content,
      raw_content: raw_content,
      source_ref: source_ref,
      parts: parts,
      attachment_types: attachment_types,
      attachment_titles: attachment_titles,
      attachment_paths: attachment_paths,
    }
    return {
      mutation: gql`
        mutation mergeSolutions(
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
          question: MergeSolution(
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
          }
        }
      `,
      variables: vars,
    }
  })
}

/**
 * 
 * @param {  
 * identity: ID!
  start: Question
  end: Solution
  source_ref: String
  raw_content: String
  value: String
  synonyms: String} answers 
 */
const getAnswerMutations = (answers) => {
  return answers.map((ans) => {
    let ansEdge = ans.r
    let attributes = ansEdge.properties
    let answerId = ansEdge.identity
    let start = ansEdge.start
    let end = ansEdge.end

    let raw_content = attributes.raw_content ? attributes.raw_content : ''
    let source_ref = attributes.source_ref ? attributes.source_ref : ''
    let value = attributes.value ? attributes.value : ''
    let synonyms = attributes.synonyms ? attributes.synonyms : ''

    let vars = {
      answerId: answerId,
      start: start,
      end: end,
      raw_content: raw_content,
      source_ref: source_ref,
      value: value,
      synonyms: synonyms,
    }
    return {
      mutation: gql`
        mutation mergeQuestionAns(
          $answerId: ID!
          $start: ID!
          $end: ID!
          $source_ref: String
          $raw_content: String
          $value: String
          $synonyms: String
        ) {
          # answer: mergeQuestionAnswer(
          #   identity: $identity
          #   start: $start
          #   end: $end
          #   source_ref: $source_ref
          #   raw_content: $raw_content
          #   value: $value
          #   synonyms: $synonyms
          # ) {
          #   raw_content
          # }

          questionSolutionEdge: MergeQuestionSolution_edges(
            data: {
              answerId: $answerId
              source_ref: $source_ref
              raw_content: $raw_content
              value: $value
              synonyms: $synonyms
              start: $start
              end: $end
            }
            to: { solutionId: $end }
            from: { questionId: $start }
          ) {
            answerId
          }

          questionQuestionEdge: MergeQuestionQuestion_edges(
            data: {
              answerId: $answerId
              source_ref: $source_ref
              raw_content: $raw_content
              value: $value
              synonyms: $synonyms
              start: $start
              end: $end
            }
            to: { questionId: $end }
            from: { questionId: $start }
          ) {
            answerId
          }

          # mergeSolutionIn_edges: MergeSolutionIn_edges(
          #   data: {
          #     identity: $identity
          #     source_ref: $source_ref
          #     raw_content: $raw_content
          #     value: $value
          #     synonyms: $synonyms
          #   }
          #   to: { solutionId: $end }
          #   from: { questionId: $start }
          # ) {
          #   identity
          # }
        }
      `,
      variables: vars,
    }
  })
}

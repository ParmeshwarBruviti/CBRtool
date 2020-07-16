import { v4 as uuidv4 } from 'uuid'

export const resolvers = {
  Query: {
    async executeRawQuery(object, params, context, info) {
      let resultJson = {
        result: await Utils.executeRawQuery(object, params, context, info),
      }
      return resultJson
    },
    /***
     * Get Questions with thier solutions and edges between them of provided count
     */
    async getAllInOne(object, params, context, info) {
      console.log('in getAllInOne with ', params)

      let resultJson = {
        questions: await Utils.getQuestions(object, params, context, info),
        solutions: await Utils.getSolutions(object, params, context, info),
        questionEdges: await Utils.getQuestionEdges(
          object,
          params,
          context,
          info
        ),
        solutionEdges: await Utils.getSolutionEdges(
          object,
          params,
          context,
          info
        ),
      }
      //console.log(resultJson)
      return resultJson
    },

    /***
     * Get all question edges of provided questionId
     */
    async getQuestionEdgesOfQuestion(object, params, context, info) {
      return await Utils.getQuestionEdges(object, params, context, info)
    },

    /***
     * Get all solution edges of provided questionId
     */
    async getSolutionEdgesOfQuestion(object, params, context, info) {
      return await Utils.getSolutionEdges(object, params, context, info)
    },

    /***
     * to get all edges of question privided questionId
     */
    async getEdgesOfQuestion(object, params, context, info) {
      return await Utils.getAllEdgesOf(object, params, context, info)
    },

    /***
     * to get all edges of question privided questionId
     */
    async getEdgesOfSolution(object, params, context, info) {
      return await Utils.getAllEdgesOf(object, params, context, info)
    },
    /***
     * to get all edges of question privided questionId
     */
    async getEdges(object, params, context, info) {
      return await Utils.getAllEdgesOf(object, params, context, info)
    },

     /***
     * to single edge of answerId / edgeId
     */
    async Edge(object, params, context, info) {
      return await Utils.getAllEdgesOf(object, params, context, info)
    },
  },
}

export const Utils = {
  executeRawQuery(object, params, context, info) {
    console.log(object, info)
    let session = context.driver.session()
    let query
    if (!params.query) {
      return { success: false }
    } else {
      query = params.query
    }
    return session
      .run(query, params)
      .then(function (result) {
        let resultArray = []
        if (result.records.length < 1) {
          console.log('records not found')
          return { success: true, message: 'records not found' }
        }
        resultArray = result.records.map((record) => {
          let fields = record._fields
          let properties = fields.map((field) => {
            return field.properties
          })
          return properties
        })
        return resultArray
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        session.close()
      })
  },
  /***
   * Fetches questions from neo4j db with provided count
   */
  getQuestions(object, params, context, info) {
    console.log(object, info)
    let session = context.driver.session()
    let query
    if (!params.count) {
      query = `MATCH (q:Question) RETURN q ;`
    } else {
      query = `MATCH (q:Question) WITH q ORDER BY toInteger(q.questionId) ASC return q LIMIT $count;`
    }
    return session
      .run(query, params)
      .then(function (result) {
        let questions = []
        if (result.records.length < 1) {
          console.log('records not found')
          return null
        }
        result.records.map((record) => {
          let QueProp = record._fields[0].properties
          //console.log('solutionId', prop)
          let question = {
            questionId: record._fields[0].identity.low,
            start: QueProp.start,
            context: QueProp.context,
            space: QueProp.space,
            hint: QueProp.hint,
            content: QueProp.content,
            raw_content: QueProp.raw_content,
            source_ref: QueProp.source_ref,
          }

          questions.push(question)
        })
        return questions
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        session.close()
      })
  },

  /***
   * Fetches solutions of first questions with provided count from neo4j db
   */
  getSolutions(object, params, context, info) {
    console.log(object, info)
    let session = context.driver.session()

    let query
    if (!params.count) {
      query = `
      MATCH (s:Solution) RETURN s;`
    } else {
      query = `
       MATCH (q:Question) WITH q ORDER BY toInteger(q.questionId) ASC LIMIT $count MATCH (q)-[:ANSWER]->(s:Solution) RETURN DISTINCT s;`
    }

    return session
      .run(query, params)
      .then(function (result) {
        let solutions = []
        if (result.records.length < 1) {
          console.log('records not found')
          return null
        }
        result.records.map((record) => {
          let prop = record._fields[0].properties
          //console.log('solutionId', prop)
          let solution = {
            solutionId: record._fields[0].identity.low,
            hint: prop.hint,
            parts: prop.parts,
            context: prop.context,
            space: prop.space,
            content: prop.content,
            raw_content: prop.raw_content,
            attachment_types: prop.attachment_types,
            attachment_titles: prop.attachment_titles,
            attachment_paths: prop.attachment_paths,
          }

          solutions.push(solution)
        })
        return solutions
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        session.close()
      })
  },

  /***
   * to fetch edges between Question and solutions for given question count
   */
  getSolutionEdges(object, params, context, info) {
    console.log(object, info)

    let query
    if (!params.questionId) {
      if (!params.count) {
        query = `
      MATCH (q:Question) WITH q MATCH (q)-[r:Answer]-> (s:Solution) return q,s,r;`
      } else {
        query = `
        MATCH (q:Question) WITH q ORDER BY toInteger(q.questionId) ASC LIMIT $count  MATCH (q)-[r:ANSWER]-> (s:Solution) return q,s,r;`
      }
    } else {
      query = `MATCH (q:Question {questionId:$questionId}) MATCH (q)-[r:ANSWER]-> (s:Solution) return q,s,r;`
    }

    console.log('in getSolutionEdges resolver')

    let session = context.driver.session()

    return session
      .run(query, params)
      .then(function (result) {
        let solutionEdges = []
        if (result.records.length < 1) {
          console.log('records not found')
          return null
        }

        result.records.map((record) => {
          let queProp = record._fields[0].properties
          let queId = record._fields[0].identity.low
          console.log('Question identity', queId)
          console.log('Question prop', queProp)

          let solProp = record._fields[1].properties
          let solId = record._fields[1].identity.low
          console.log('Solution id', solId)
          console.log('Solution prop', solProp)

          let edgeId = uuidv4()
          let prop = record._fields[2].properties
          console.log('Edge id', edgeId)
          console.log('Edge prop', prop)

          let question = {
            questionId: queId,
            start: queProp.start,
            context: queProp.context,
            space: queProp.space,
            hint: queProp.hint,
            content: queProp.content,
            raw_content: queProp.raw_content,
            source_ref: queProp.source_ref,
          }

          let solution = {
            solutionId: solId,
            hint: solProp.hint,
            parts: solProp.parts,
            context: solProp.context,
            space: solProp.space,
            content: solProp.content,
            raw_content: solProp.raw_content,
            attachment_types: solProp.attachment_types,
            attachment_titles: solProp.attachment_titles,
            attachment_paths: solProp.attachment_paths,
          }

          let edge = {
            answerId: edgeId,
            source_ref: prop.source_ref,
            raw_content: prop.raw_content,
            value: prop.value,
            synonyms: prop.synonyms,
            from: question,
            to: solution,
            start: prop.start,
            end: prop.end,
          }

          solutionEdges.push(edge)
        })
        return solutionEdges
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        session.close()
      })
  },

  /***
   * to fetch edges between Question and solutions for given question count
   */
  getQuestionEdges(object, params, context, info) {
    console.log(object, info)

    let query
    if (!params.questionId) {
      if (!params.count) {
        query = `
      MATCH (q1:Question) WITH q1 MATCH (q1)-[r:Answer]-> (q2:Question) return q1,q2,r;`
      } else {
        query = `
        MATCH (q2:Question)<-[r:ANSWER]-(q1:Question) WITH q1,q2,r ORDER BY toInteger(q2.questionId) ASC LIMIT $count-1 RETURN q1,q2,r`
      }
    } else {
      query = `
      MATCH (q1:Question {questionId:$questionId}) WITH q1 MATCH (q1)-[r:ANSWER]-> (q2:Question) return q1,q2,r;`
    }

    console.log('in getQuestionEdges resolver')

    let session = context.driver.session()

    return session
      .run(query, params)
      .then(function (result) {
        if (result.records.length < 1) {
          console.log('records not found')
          return null
        }

        let questionEdges = result.records.map((record) => {
          let QueProp1 = record._fields[0].properties
          console.log('Question1', QueProp1)

          let que2Prop = record._fields[1].properties
          console.log('Question2', que2Prop)

          let prop = record._fields[2].properties
          console.log('Edge', prop)

          let question1 = {
            questionId: record._fields[0].identity.low,
            start: QueProp1.start,
            context: QueProp1.context,
            space: QueProp1.space,
            hint: QueProp1.hint,
            content: QueProp1.content,
            raw_content: QueProp1.raw_content,
            source_ref: QueProp1.source_ref,
          }

          let question2 = {
            questionId: record._fields[1].identity.low,
            start: que2Prop.start,
            context: que2Prop.context,
            space: que2Prop.space,
            hint: que2Prop.hint,
            content: que2Prop.content,
            raw_content: que2Prop.raw_content,
            source_ref: que2Prop.source_ref,
          }

          let edge = {
            answerId: uuidv4(),
            source_ref: prop.source_ref,
            raw_content: prop.raw_content,
            value: prop.value,
            synonyms: prop.synonyms,
            from: question1,
            to: question2,
            start: prop.start,
            end: prop.end,
          }

          return edge
        })
        return questionEdges
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        session.close()
      })
  },

  /***
   * getAllEdgesOFQuestion - for particular question
   * getAllEdgesOfSolution - for particular solution
   * getEdges - all edges with count
   */
  getAllEdgesOf(object, params, context, info) {
    console.log(object, info)

    let query
    if(params.answerId){
      query = `MATCH (q:Question)-[r:ANSWER]->() where r.answerId = $answerId return r;`
    } else if (params.questionId) {
      query = `MATCH (q:Question {questionId:$questionId}) WITH q MATCH (q)-[r:ANSWER]-() return r;`
    } else if (params.solutionId) {
      query = `MATCH (s:Solution {solutionId:$solutionId}) WITH s MATCH (s)-[r:ANSWER]-() return r;`
    } else if (params.count && params.count > 0) {
      query = `MATCH ()-[r:ANSWER]-() return r LIMIT $count;`
    } else {
      query = `MATCH ()-[r:ANSWER]-() return r;`
    }

    console.log('in getAllEdges resolver')

    let session = context.driver.session()

    return session
      .run(query, params)
      .then(function (result) {
        if (result.records.length < 1) {
          console.log('records not found')
          return null
        }

        let questionEdges = result.records.map((record) => {
          let edgeProp = record._fields[0].properties
          console.log('Edges - ', edgeProp)

          let edge = {
            answerId: edgeProp.answerId,
            source_ref: edgeProp.source_ref,
            raw_content: edgeProp.raw_content,
            value: edgeProp.value,
            synonyms: edgeProp.synonyms,
            start: edgeProp.start,
            end: edgeProp.end,
          }

          return edge
        })
        return questionEdges
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        session.close()
      })
  },
}

export const resolvers = {
  Query: {
    async getQuestions(object, params, context, info) {
      return await Utils.getQuestions(object, params, context, info)
    },

    async getSolutions(object, params, context, info) {
      return await Utils.getSolutions(object, params, context, info)
    },

    /***
     * to fetch edges between Question and solutions for given question count
     */
    async getSolutionEdges(object, params, context, info) {
      return await Utils.getSolutionEdges(object, params, context, info)
    },

    /***
     * to fetch edges between Question and solutions for given question count
     */
    async getQuestionEdges(object, params, context, info) {
      return await Utils.getQuestionEdges(object, params, context, info)
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
      console.log(resultJson)
      return resultJson
    },
  },
}

export const Utils = {
  /***
   * Fetches questions from neo4j db with provided count
   */
  getQuestions(object, params, context, info) {
    console.log(object, info)
    let session = context.driver.session()
    let query = `
    MATCH (q:Question) RETURN q LIMIT $count;`

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
            questionId: QueProp.questionId,
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
    let query = `
        MATCH (q:Question) WITH q LIMIT $count MATCH (q)-[:ANSWER]->(s:Solution) RETURN DISTINCT s;`

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
            solutionId: prop.solutionId,
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
    let query = `
    MATCH (q:Question) WITH q LIMIT $count MATCH (q)-[r:ANSWER]-> (s:Solution) return q,s,r;`
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
          let QueProp = record._fields[0].properties
          console.log('Question', QueProp)

          let solProp = record._fields[1].properties
          console.log('Solution', solProp)

          let prop = record._fields[2].properties
          console.log('Edge', prop)

          let question = {
            questionId: QueProp.questionId,
            start: QueProp.start,
            context: QueProp.context,
            space: QueProp.space,
            hint: QueProp.hint,
            content: QueProp.content,
            raw_content: QueProp.raw_content,
            source_ref: QueProp.source_ref,
          }

          let solution = {
            solutionId: solProp.solutionId,
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
            identity: prop.identity,
            source_ref: prop.source_ref,
            raw_content: prop.raw_content,
            value: prop.value,
            synonyms: prop.synonyms,
            from: question,
            to: solution,
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
    let query = `
    MATCH (q1:Question) WITH q1 LIMIT $count MATCH (q1)-[r:ANSWER]-> (q2:Question) return q1,q2,r;`
    console.log('in getQuestionEdges resolver')

    let session = context.driver.session()

    return session
      .run(query, params)
      .then(function (result) {
        let questionEdges = []
        if (result.records.length < 1) {
          console.log('records not found')
          return null
        }

        result.records.map((record) => {
          let QueProp1 = record._fields[0].properties
          console.log('Question1', QueProp1)

          let que2Prop = record._fields[1].properties
          console.log('Question2', que2Prop)

          let prop = record._fields[2].properties
          console.log('Edge', prop)

          let question1 = {
            questionId: QueProp1.questionId,
            start: QueProp1.start,
            context: QueProp1.context,
            space: QueProp1.space,
            hint: QueProp1.hint,
            content: QueProp1.content,
            raw_content: QueProp1.raw_content,
            source_ref: QueProp1.source_ref,
          }

          let question2 = {
            questionId: que2Prop.questionId,
            start: que2Prop.start,
            context: que2Prop.context,
            space: que2Prop.space,
            hint: que2Prop.hint,
            content: que2Prop.content,
            raw_content: que2Prop.raw_content,
            source_ref: que2Prop.source_ref,
          }

          let edge = {
            identity: prop.identity,
            source_ref: prop.source_ref,
            raw_content: prop.raw_content,
            value: prop.value,
            synonyms: prop.synonyms,
            from: question1,
            to: question2,
          }

          questionEdges.push(edge)
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

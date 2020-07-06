export const resolvers = {
  Query: {
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
  },
}

export const resolvers = {
  Query: {
    getSolutions(params, context) {
      let session = context.driver.session()
      let query = `
          MATCH (q:Question) WITH q LIMIT $count MATCH (q)-[:ANSWER]->(s:Solution) RETURN DISTINCT s;`

      return session
        .run(query, params)
        .then(function (result) {
          let solutions = []
          if (result.records.length < 1) {
            return null
          }
          result.records.map((record) => {
            let prop = record._fields[0].properties
            console.log('solutionId', prop)
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
    getSolutionEdges(params, context) {
      let query = `
      MATCH (q:Question) WITH q LIMIT $count MATCH (q)-[r:ANSWER]-> (s:Solution) return r;`
      let session = context.driver.session()
      return session
        .run(query, params)
        .then(function (result) {
          let solutionEdges = []
          if (result.records.length < 1) {
            return null
          }
          result.records.map((record) => {
            let prop = record._fields[0].properties
            console.log('identity', prop)
            let edge = {
              identity: prop.identity,
              source_ref: prop.source_ref,
              raw_content: prop.raw_content,
              value: prop.value,
              synonyms: prop.synonyms,
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

import ApolloClient from 'apollo-client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getSeedMutations } from './seed-mutations'

dotenv.config()

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
} = process.env

const uri = `http://${host}:${port}${path}`
//const uri = 'http://api:4001/graphql'

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

const runMutations = () => {
  const mutations = getSeedMutations()
  return new Promise((resolve, reject) => {
    mutations.reduce((pre, { mutation, variables }, index) => {
      return pre.then(() => {
        return client
          .mutate({
            mutation,
            variables,
          })
          .then(() => {
            console.log('Progress --->', index, ' / ', mutations.length - 1)
            if (mutations.length - 1 === index) {
              resolve()
            }
          })
          .catch((e) => {
            console.log('Error --->', e)
            reject()
            throw new Error(e)
          })
      })
    }, Promise.resolve())
  })
}

function printMessage(message) {
  console.log('==========================================')
  console.log(message)
  console.log('==========================================')
}

runMutations()
  .then(() => {
    printMessage('Database seeded Successfully!')
  })
  .catch((e) => {
    if (e) {
      console.error('Exception --- > ', e)
      printMessage('Database seeding Failed, Trying one more time !')
    }
  })

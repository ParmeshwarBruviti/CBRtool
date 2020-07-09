import gql from 'graphql-tag'

const GET_ALL_NODES_EDGES = gql`
  {
    getAllInOne(count: 20)
  }
`

export { GET_ALL_NODES_EDGES }

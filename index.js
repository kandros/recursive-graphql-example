const { ApolloServer, gql } = require('apollo-server')

const items = [
  { id: 1, childrens: [2, 3] },
  { id: 2, childrens: [1, 3] },
  { id: 3, childrens: [4, 5] },
  { id: 4, childrens: [] },
  { id: 5, childrens: [] },
]

function getItemById(id) {
  return items.find(x => x.id === id)
}

function mapIdListToItemList(ids) {
  return ids.map(getItemById)
}

const typeDefs = gql`
  type Item {
    id: Int!
    childrens: [Item]
  }

  type Query {
    getItemById(id: Int): Item
    getItems: [Item]
  }
`

const resolvers = {
  Query: {
    getItems: () => items,
    getItemById: (_parent, { id }) => getItemById(id),
  },
  Item: {
    id: parent => parent.id,
    childrens: (parent /* an Item without children field {id: Int, childrens: Int} */) => {
      const cs = mapIdListToItemList(parent.childrens)
      return cs
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

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

const typeDefs = gql`
  type Item {
    id: Int!
    childrens: [Item!]!
    anotherField: AnotherField!
    idWithEmoji: String!
    childrensCount: Int!
    hasChildrens: Boolean!
  }

  type AnotherField {
    valid: Boolean!
  }

  input CreateItemInput {
    id: Int!
    childrens: [Int!]
  }

  type Query {
    getItemById(id: Int!): Item
    getItems: [Item!]!
  }

  type Mutation {
    createItem(input: CreateItemInput!): Boolean
  }
`

const resolvers = {
  Query: {
    getItems: () => {
      return items
    },
    getItemById: (_parent, { id }) => {
      return getItemById(id)
    },
  },
  Mutation: {
    createItem: (parent, args) => {
      items.push({
        id: args.input.id,
        childrens: args.input.childrens || [],
      })
      return true
    },
  },
  AnotherField: {
    valid() {
      return true
    },
  },
  Item: {
    childrensCount(parent, args, context) {
      return parent.childrens.length
    },
    hasChildrens(parent, args, context) {
      return parent.childrens.length > 0
    },
    anotherField(parent, args, context) {
      return {}
    },
    idWithEmoji(parent) {
      return `${parent.id}-🎁`
    },
    childrens: (parent, /* an Item without children field {id: Int, childrens: Int} */ args, context) => {
      const cs = parent.childrens.map(getItemById)
      return cs
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    user: {
      id: '123',
      name: 'pippo',
    },
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

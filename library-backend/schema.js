const typeDefs = `

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  #Tehty tehtävää 2. all books queryä varten
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  #Tehtävä 4. addBook mutationia varten
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    #tehtävää 7 varten lisätty editAuthor mutation
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

module.exports = typeDefs
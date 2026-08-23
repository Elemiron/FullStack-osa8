const { GraphQLError } = require('graphql')
const Author = require('./models/Author')
const Book = require('./models/Book')

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),

    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      let query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (author) {
          query.author = author._id
        }
      }

      if (args.genre) {
        query.genres = args.genre
      }

      return Book.find(query).populate('author')
    },

    allAuthors: async () => {
      return Author.find({})
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      try {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
          author = new Author({
            name: args.author,
          })

          await author.save()
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres,
        })

        return await book.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      await author.save()

      return author
    },
  },
}

module.exports = resolvers
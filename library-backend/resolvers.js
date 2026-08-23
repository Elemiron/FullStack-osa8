const jwt = require('jsonwebtoken')
const User = require('./models/User')
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

    me: async (root, args, context) => {
      const auth = context.req.headers.authorization

      if (!auth) {
        return null
      }

      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      )

      return User.findById(decodedToken.id)
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const auth = context.req.headers.authorization

      if (!auth) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      )

      // token on validi → jatketaan normaalisti
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

    editAuthor: async (root, args, context) => {
      const auth = context.req.headers.authorization

      if (!auth) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      )

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      await author.save()

      return author
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        password: 'secret',
      })

      return user.save()
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || user.password !== args.password) {
        throw new GraphQLError('Invalid username or password', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
}

module.exports = resolvers
const Author = require('./models/Author')
const Book = require('./models/Book')

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),

    authorCount: async () => Author.countDocuments(),

    allBooks: async () => {
      return Book.find({})
    },

    allAuthors: async () => {
      return Author.find({})
    },
  },

  Mutation: {
    addBook: async (root, args) => {
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

      return book.save()
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
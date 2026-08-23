require('dotenv').config()

const mongoose = require('mongoose')
const Author = require('./models/Author')
const Book = require('./models/Book')

console.log('starting...')
console.log('uri exists:', !!process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(error => {
    console.log('MongoDB error:', error.message)
  })

const authors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky',
  },
  {
    name: 'Sandi Metz',
  },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution'],
  },
]

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI)

  await Author.deleteMany({})
  await Book.deleteMany({})

  const savedAuthors = await Author.insertMany(authors)

  const booksWithAuthorIds = books.map(book => ({
    ...book,
    author: savedAuthors.find(author => author.name === book.author)._id,
  }))

  await Book.insertMany(booksWithAuthorIds)

  console.log('database initialized')

  await mongoose.connection.close()
}

main()
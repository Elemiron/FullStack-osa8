import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(
  localStorage.getItem('library-user-token')
)

  //Authors view
  const authors = [
  {
    id: '1',
    name: 'Robert Martin',
    born: 1952,
    bookCount: 2,
  },
  {
    id: '2',
    name: 'Martin Fowler',
    born: 1963,
    bookCount: 1,
  },
  {
    id: '3',
    name: 'Fyodor Dostoevsky',
    born: 1821,
    bookCount: 2,
  },
]

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token && (
          <button onClick={() => setPage('add')}>add book</button>
        )}

        {!token && (
          <button onClick={() => setPage('login')}>login</button>
        )}

        {token && (
          <button
            onClick={() => {
              setToken(null)
              localStorage.removeItem('library-user-token')
              setPage('authors')
            }}
          >
            logout
          </button>
        )}
      </div>

      <Authors 
        show={page === 'authors'} 
        authors={authors}
        token={token}
      />


      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      <LoginForm show={page === 'login'} setToken={setToken} />
    </div>
  )
}

export default App

import { useState } from 'react'
import { useMutation, gql } from '@apollo/client'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
        const token = data.login.value
        setToken(token)
        localStorage.setItem('library-user-token', token) //Mun oma lisäys, jotta token säilyy selaimen local storagessa eikä esimerkin phonebook
        setPage('authors')
    },
    onError: () => {
        setError('login failed')
    },
  })

  const submit = (event) => {
    event.preventDefault()

    login({
      variables: {
        username,
        password,
      },
    })
  }
  if (!show) {
    return null
    }

  return (
    <div>
      <h2>login</h2>

      {error && <div>{error}</div>}

      <form onSubmit={submit}>
        <div>
            <label>
                username
                <input
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
            </label>
        </div>

        <div>
            <label>
            password
            <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
            />
            </label>
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
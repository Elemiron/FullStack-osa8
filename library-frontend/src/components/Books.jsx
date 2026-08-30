import { useQuery, gql } from '@apollo/client'
import { useState } from 'react'


const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  // Näytetään kaikki kirjat, jos genreä ei ole valittu.
  // Muuten näytetään vain valittuun genreen kuuluvat kirjat.
  const booksToShow = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books

  // Kerätään kaikista kirjoista kaikki eri genret.
  const genres = [...new Set(books.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

       {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}

      <button onClick={() => setGenre(null)}>
        all genres
      </button>
    </div>
  )
}

export default Books

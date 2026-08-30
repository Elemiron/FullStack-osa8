import { useQuery, gql } from '@apollo/client'
import { useState } from 'react'


const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
// Tehty 8.22: haetaan kaikki kirjat erikseen, jotta kaikki genrenapit pysyvät näkyvissä
const ALL_BOOKS_FOR_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`
// Tehty 8.23: haetaan tuore lista serveriltä aina genreä vaihdettaessa
const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables : {
      genre,
    },
  })

  const selectGenre = (genre) => {
    setGenre(genre)
    result.refetch({ genre })
  }

  const allBooksResult = useQuery(ALL_BOOKS_FOR_GENRES)

  if (!props.show) {
    return null
  }

  if (result.loading || allBooksResult.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const allBooks = allBooksResult.data.allBooks

  // Tehty 8.22: kirjat suodatetaan nyt GraphQL-kyselyllä Reactin sijaan.
  // Valittu genre lähetetään allBooks-querylle muuttujana.


  // Kerätään kaikista kirjoista kaikki eri genret.
  const genres = [...new Set(allBooks.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>

      {genre && <div>in genre <b>{genre}</b></div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

       {genres.map((g) => (
        <button key={g} onClick={() => selectGenre(g)}>
          {g}
        </button>
      ))}

      <button onClick={() => selectGenre(null)}>
        all genres
      </button>
    </div>
  )
}

export default Books

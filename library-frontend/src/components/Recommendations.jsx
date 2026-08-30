import { useQuery, gql } from '@apollo/client'
// Tehty 8.21 part 2: tarvitaan, jotta suositeltujen kirjojen lista saadaan näkyviin
const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks{
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const Recommendations = (props) => {
  const meResult = useQuery(ME, {
    skip: !props.show,
    })
    
    const booksResult = useQuery(ALL_BOOKS, {
        skip: !props.show,
    })
    
    if (!props.show) {
    return null
    }
    
    if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
    }
    
    if (meResult.error) {
    return <div>{meResult.error.message}</div>
    }

    if (booksResult.error) {
    return <div>{booksResult.error.message}</div>
    }

    if (!meResult.data.me) {
    return <div>not logged in</div>
    }
    
    const favoriteGenre = meResult.data.me.favoriteGenre
    const books = booksResult.data.allBooks

    const recommendedBooks = books.filter((book) =>
        book.genres.includes(favoriteGenre)
    )
    
    return (
    <div>
      <h2>recommendations</h2>
      
      <div>books in your favorite genre <b>{favoriteGenre}</b></div>
      
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {recommendedBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}

export default Recommendations
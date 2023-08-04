import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div>
      <h2>Error: the page is not found</h2>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </div>
  )
}

export default NotFoundPage

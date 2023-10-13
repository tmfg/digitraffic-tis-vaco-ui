import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className={'sub-page'}>
      <h3>Error: nothing exists on the specified URL path.</h3>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </div>
  )
}

export default NotFoundPage

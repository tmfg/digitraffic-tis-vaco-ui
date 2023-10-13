import { Link } from 'react-router-dom'

const AuthRequiredPage = () => {
  return (
    <>
      <h3>Error: login required to proceed.</h3>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </>
  )
}

export default AuthRequiredPage

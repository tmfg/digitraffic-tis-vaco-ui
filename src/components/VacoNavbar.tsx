import { Link } from 'react-router-dom'

const VacoNavbar = () => {
  return (
    <header
      style={{
        boxShadow:
          'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
        borderColor: 'gray',
        height: 55,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Link
        to={'/'}
        style={{
          marginLeft: 24,
          fontFamily: 'PublicSans-ExtraBold',
          fontSize: '1.2rem',
          lineHeight: 1.2,
          marginRight: 24
        }}
      >
        VACO
      </Link>
      <Link
        to={'/dashboard'}
        style={{
          marginLeft: 24,
          fontFamily: 'PublicSans-Medium',
          fontSize: '1rem',
          lineHeight: 1.2,
          marginRight: 24
        }}
      >
        {' '}
        Dashboard{' '}
      </Link>
      <Link
        to={'/ticket/request'}
        style={{
          marginLeft: 24,
          fontFamily: 'PublicSans-Medium',
          fontSize: '1rem',
          lineHeight: 1.2,
          marginRight: 24
        }}
      >
        Create ticket
      </Link>
      <Link
        to={'/ticket/info'}
        style={{
          marginLeft: 24,
          fontFamily: 'PublicSans-Medium',
          fontSize: '1rem',
          lineHeight: 1.2,
          marginRight: 24
        }}
      >
        {' '}
        View ticket{' '}
      </Link>
    </header>
  )
}

export default VacoNavbar

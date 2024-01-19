import { FdsAlertComponent } from '../../components/fds/FdsAlertComponent'
import '../../link.scss'

const NoCompaniesErrorPage = () => {
  return (
    <>
      <div style={{ width: 'fit-content', marginTop: '2.5rem' }}>
        <FdsAlertComponent icon={'alert-triangle'}>
          You are not part of any company or organization yet.
        </FdsAlertComponent>
      </div>
      <p>
        We are working on making it possible to use this functionality without belonging to a company or organisation.
      </p>
      <p>
        But for now, to start using VACO, please contact{' '}
        <a className={'link'} href={'https://www.fintraffic.fi/fi/fintraffic/validointi-ja-konvertointipalvelu'}>
          support
        </a>{' '}
        to get the right user group assigned.
      </p>

    </>
  )
}

export default NoCompaniesErrorPage

import { FdsAlertComponent } from '../../components/fds/FdsAlertComponent'
import '../../link.scss'

const AdminRoleRequiredPage = () => {
  return (
    <>
      <div style={{ width: 'fit-content', marginTop: '2.5rem' }}>
        <FdsAlertComponent icon={'alert-triangle'}>
          You do not have sufficient admin rights to view this page.
        </FdsAlertComponent>
      </div>
      <p>
        Please, contact{' '}
        <a className={'link'} href={'https://www.fintraffic.fi/fi/fintraffic/validointi-ja-konvertointipalvelu'}>
          support
        </a>{' '}
        to get the right user role assigned.
      </p>
    </>
  )
}

export default AdminRoleRequiredPage

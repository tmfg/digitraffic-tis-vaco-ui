import { Outlet } from 'react-router-dom'
import FintrafficNavbar from './components/FintrafficNavbar'
import VacoNavbar from './components/VacoNavbar'
import Footer from './components/Footer'

const AppLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FintrafficNavbar />
      <VacoNavbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AppLayout

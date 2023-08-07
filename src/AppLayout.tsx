import { Outlet } from 'react-router-dom'
import FintrafficBar from './components/FintrafficBar'
import VacoNavbar from './components/VacoNavbar'
import Footer from './components/Footer'

const AppLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FintrafficBar />
      <VacoNavbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AppLayout

import './footer.scss'
import { ReactComponent as FintrafficLogo } from '../../assets/svg/fintraffic_logo.svg'

const Footer = () => {
  return (
    <footer className={'footer'}>
      <div className={'footer__brand'}>
        <a href={'https://www.fintraffic.fi/'}>
          <div style={{ display: 'flex', alignItems: 'center', width: '110px', flexShrink: 0 }}>
            <FintrafficLogo />
          </div>
        </a>
        <a href="https://www.fintraffic.fi/fi">fintraffic.fi</a>
      </div>
      <div className={'footer__links-container'}>
        <div className={'footer__link-column'}>
          <ul>
            <li>
              <a href="https://liikennetilanne.fintraffic.fi/pulssi/">Traffic Situation</a>
            </li>
            <li>
              <a href="https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa">Feedback Channel</a>
            </li>
            <li>
              <a href="https://www.digitraffic.fi/">Train Departures</a>
            </li>
            <li>
              <a href="https://skynavx.fi/#/drone">Drone Services</a>
            </li>
          </ul>
        </div>
        <div className={'footer__link-column'}>
          <ul>
            <li>
              <a href="https://www.digitraffic.fi/">Digitraffic</a>
            </li>
            <li>
              <a href="https://digitransit.fi/">Digitransit</a>
            </li>
            <li>
              <a href="https://finap.fi/#/">NAP</a>
            </li>
          </ul>
        </div>
        <div className={'footer__link-column'}>
          <ul>
            <li>
              <a href="https://www.fintraffic.fi/en/fintraffic/contact-information-and-invoicing-instructions">
                Contact information
              </a>
            </li>
            <li>
              <a href="https://www.fintraffic.fi/fi/fintraffic/tietosuoja">Privacy policy</a>
            </li>
            <li>
              <a href="https://www.fintraffic.fi/fi/fintraffic/saavutettavuusseloste">Accessibility</a>
            </li>
          </ul>
        </div>
        <div className="footer__link-column">
          <a style={{ marginRight: '1rem' }} href="https://www.facebook.com/FintrafficFI">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-facebook"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a style={{ marginRight: '1rem' }} href="https://twitter.com/Fintraffic_fi">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-twitter"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          <a style={{ marginRight: '1rem' }} href="https://www.instagram.com/fintraffic_stories_fi">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-instagram"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a style={{ marginRight: '1rem' }} href="https://www.youtube.com/channel/UCpnhwBRjt58yUu_Oky7vyxQ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-youtube"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/fintraffic">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-linkedin"
            >
              <title> LinkedIn</title>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import Navbar from './Navbar'
import { MemoryRouter } from 'react-router-dom'
import { FdsNavigationItem, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import i18next from 'i18next'

describe('Navbar component tests', () => {
  it('Renders Navbar', () => {
    const items: FdsNavigationItem[] = [
      {
        label: i18next.t('fintraffic:traffic'),
        value: 'https://liikennetilanne.fintraffic.fi/pulssi/'
      },
      {
        label: i18next.t('fintraffic:feedback'),
        value: 'https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa'
      }
    ]

    render(
      <MemoryRouter>
        <Navbar barIndex={0} variant={FdsNavigationVariant.primary} items={items} selectedItem={items[0]} />
      </MemoryRouter>
    )

    // Web components apparently can't be rendered, so can't assert the contents of the Navbar
  })
})

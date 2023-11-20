import * as React from 'react'
import { createComponent } from '@lit-labs/react'
import FdsDropdown from '../../../coreui-components/src/fds-dropdown'

export const FdsDropdownComponent = createComponent({
  tagName: 'fds-dropdown',
  elementClass: FdsDropdown,
  react: React
})

import * as React from 'react'
import { createComponent } from '@lit-labs/react'
import FdsCheckbox from '../../../coreui-components/src/fds-checkbox'

export const FdsCheckboxComponent = createComponent({
  tagName: 'fds-checkbox',
  elementClass: FdsCheckbox,
  react: React
})

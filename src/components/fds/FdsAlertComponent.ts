import * as React from 'react'
import { createComponent } from '@lit-labs/react'
import FdsAlert from '../../../coreui-components/src/fds-alert'

export const FdsAlertComponent = createComponent({
  tagName: 'fds-alert',
  elementClass: FdsAlert,
  react: React
})

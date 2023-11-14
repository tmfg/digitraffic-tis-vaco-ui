import * as React from 'react'
import { createComponent } from '@lit-labs/react'
import FdsCard from '../../../coreui-components/src/fds-card'

export const FdsCardComponent = createComponent({
  tagName: 'fds-card',
  elementClass: FdsCard,
  react: React
})

import FdsNavigation from '../../../coreui-components/src/fds-navigation.ts'
import * as React from 'react'
import { createComponent } from '@lit-labs/react'

export const FdsNavigationComponent = createComponent({
  tagName: 'fds-navigation',
  elementClass: FdsNavigation,
  react: React
})

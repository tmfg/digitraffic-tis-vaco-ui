import * as React from 'react'
import { createComponent } from '@lit-labs/react'
import FdsDialog from '../../../coreui-components/src/fds-dialog'

export const FdsDialogComponent = createComponent({
  tagName: 'fds-dialog',
  elementClass: FdsDialog,
  react: React
})

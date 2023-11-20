import * as React from 'react'
import { createComponent } from '@lit-labs/react'
import FdsInput from '../../../coreui-components/src/fds-input'

export const FdsInputComponent = createComponent({
  tagName: 'fds-input',
  elementClass: FdsInput,
  react: React
})

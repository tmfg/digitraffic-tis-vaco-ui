import * as React from 'react'
import { createComponent, EventName } from '@lit-labs/react'
import FdsButton from '../../../coreui-components/src/fds-button.ts'

export const FdsButtonComponent = createComponent({
  tagName: 'fds-button',
  elementClass: FdsButton,
  react: React,
  events: {
    onClick: 'pointerdown' as EventName<PointerEvent>
  }
})

import * as React from 'react'
import { createComponent, EventName } from '@lit-labs/react'
import FdsButton from '@fintraffic-design/coreui-components/src/fds-button'

export const FdsButtonComponent = createComponent({
  tagName: 'fds-button',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  elementClass: FdsButton,
  react: React,
  events: {
    onClick: 'pointerdown' as EventName<PointerEvent>
  }
})

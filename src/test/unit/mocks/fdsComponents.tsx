import { ReactNode, useRef } from 'react'

interface ButtonProps {
  label?: string
  icon?: string
  disabled?: boolean
  onClick?: () => void
}

interface InputProps {
  name: string
  label?: string
  message?: string
}

interface ChildrenProps {
  children?: ReactNode
}

const Passthrough = ({ children }: ChildrenProps) => <div>{children}</div>

// Marks disabled with aria-disabled and keeps firing onClick: the real fds-button emits its click event
// (pointerdown) on the host even when disabled, so handlers must guard themselves
const FdsButtonComponent = ({ label, icon, disabled, onClick }: ButtonProps) => (
  <button type="button" aria-label={label ?? icon} aria-disabled={disabled || undefined} onClick={onClick}>
    {label}
  </button>
)

// Emits the same bubbling CustomEvent('change') that the real fds-input dispatches
const FdsInputComponent = ({ name, label, message }: InputProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <div ref={ref}>
      <input
        aria-label={label}
        onInput={(e) =>
          ref.current?.dispatchEvent(
            new CustomEvent('change', { bubbles: true, detail: { name, value: e.currentTarget.value } })
          )
        }
      />
      {message && <span>{message}</span>}
    </div>
  )
}

const FdsAlertComponent = ({ children }: ChildrenProps) => <div role="alert">{children}</div>

export const fdsComponentMocks = {
  button: { FdsButtonComponent },
  input: { FdsInputComponent },
  alert: { FdsAlertComponent },
  card: { FdsCardComponent: Passthrough },
  dialog: { FdsDialogComponent: Passthrough },
  actionSheet: { FdsActionSheetComponent: Passthrough }
}

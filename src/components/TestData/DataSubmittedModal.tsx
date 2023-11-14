import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'

interface ModalProps {
  close: () => void
  proceed: () => void
}

const DataSubmittedModal = ({ close, proceed }: ModalProps) => {
  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">Data submitted</h4>
          <p>Your data is submitted successfully for validation</p>
          <p>You will receive a validation report in email after the processing is complete</p>
          <p>You can navigated to view the submitted feed by clicking "Proceed".</p>
          <FdsActionSheetComponent>
            <FdsButtonComponent onClick={proceed} slot="separated" label="Proceed" />
            <FdsButtonComponent onClick={close} icon="x" variant={FdsButtonVariant.secondary} label={'Close'} />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default DataSubmittedModal

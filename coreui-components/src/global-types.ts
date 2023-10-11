import FdsActionSheet from './fds-action-sheet'
import FdsAlert from './fds-alert'
import FdsButton from './fds-button'
import FdsCard from './fds-card'
import FdsCheckbox from './fds-checkbox'
import FdsCombobox from './fds-combobox'
import FdsDialog from './fds-dialog'
import FdsDivider from './fds-divider'
import FdsDropdown from './fds-dropdown'
import FdsIcon from './fds-icon'
import FdsInput from './fds-input'
import FdsNavigation from './fds-navigation'
import FdsPopover from './fds-popover'
import FdsTable from './fds-table'

declare global {
  interface HTMLElementTagNameMap {
    'fds-icon': FdsIcon
    'fds-card': FdsCard
    'fds-dialog': FdsDialog
    'fds-button': FdsButton
    'fds-action-sheet': FdsActionSheet
    'fds-alert': FdsAlert
    'fds-navigation': FdsNavigation
    'fds-dropdown': FdsDropdown<never>
    'fds-divider': FdsDivider
    'fds-checkbox': FdsCheckbox
    'fds-combobox': FdsCombobox
    'fds-popover': FdsPopover
    'fds-table': FdsTable
    'fds-input': FdsInput
  }
}

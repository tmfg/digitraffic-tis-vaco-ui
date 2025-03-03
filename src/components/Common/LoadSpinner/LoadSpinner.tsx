import LoadSpinnerSvg from '../../../assets/svg/load_spinner.svg'
import './_loadSpinner.scss'

export enum SpinnerVariant {
  padded = 'padded',
  unpadded = 'unpadded'
}

interface LoadSpinnerProps {
  variant?: SpinnerVariant
}

const LoadSpinner = ({ variant = SpinnerVariant.unpadded }: LoadSpinnerProps) => {
  return (
    <div className={variant}>
      <LoadSpinnerSvg />
    </div>
  )
}

export default LoadSpinner

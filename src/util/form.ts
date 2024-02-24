import { Map } from '../types/Map'
import { FdsInputChange } from '../../coreui-components/src/fds-input'

export const getNewFormState = (formData: Map, inputChange: FdsInputChange) => {
  const newFormData: Map = {
    ...formData
  }
  newFormData[inputChange.name] = inputChange.value
  return newFormData
}

export const getNewFormStateAfterMultipleChanges = (formData: Map, inputsToChange: FdsInputChange[]) => {
  const newFormData: Map = {
    ...formData
  }

  inputsToChange.forEach((inputChange) => {
    newFormData[inputChange.name] = inputChange.value
  })

  return newFormData
}

export const getNewFormErrorsState = (formErrors: Map, inputChange: FdsInputChange) => {
  if (formErrors[inputChange.name]) {
    const newFormErrors = { ...formErrors }
    newFormErrors[inputChange.name] = undefined
    return newFormErrors
  }
  return formErrors
}

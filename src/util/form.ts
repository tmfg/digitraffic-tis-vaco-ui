import { Map } from '../types/Map'
import { FdsInputChange } from '../../coreui-components/src/fds-input'

export const generalListener = (
  e: Event,
  updateFormState: (newFormData: Map | null, newFormErrors: Map | null) => void,
  formData: Map,
  formErrors: Map
) => {
  const detail = (e as CustomEvent).detail as FdsInputChange
  const newFormState = getNewFormState(formData, detail)
  const newFormErrorsState = getNewFormErrorsState(formErrors, detail)
  updateFormState(newFormState, newFormErrorsState)
}

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

export const getNewFormErrorsStateAfterMultipleChanges = (formErrors: Map, changedInputs: FdsInputChange[]) => {
  const newFormErrors = { ...formErrors }

  changedInputs.forEach((inputChange) => {
    newFormErrors[inputChange.name] = undefined
  })

  return newFormErrors
}

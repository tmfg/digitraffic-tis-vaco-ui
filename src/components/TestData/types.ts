import { ValidationInput } from '../../types/EntryResource'
import { Map } from '../../types/Map'

export interface EntryRequest {
  url: string
  name: string
  format: string
  businessId: string
  etag?: string
  context: string
  validations: ValidationInput[]
  conversion?: object
  metadata?: object
  notifications?: string[]
}

export interface FormComponentProps {
  formData: Map
  formErrors: Map
  formStateUpdateCallback: (newFormData: Map | null, newFormErrors: Map | null) => void
}

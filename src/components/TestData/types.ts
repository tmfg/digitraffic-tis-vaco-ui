import { RuleInput } from '../../types/EntryResource'
import { Map } from '../../types/Map'

export interface EntryRequest {
  url: string
  name: string
  format: string
  businessId: string
  etag?: string
  context: string
  validations: RuleInput[] | undefined
  conversions: RuleInput[] | undefined
  metadata?: object
  notifications?: string[]
  credentials?: string
}

export interface FormSectionProps {
  formData: FormData
  formErrors: FormError
  formStateUpdateCallback: (newFormData: FormData | null, newFormErrors: FormError | null) => void
}

// Map covers the dynamic fields coming from [rule-"rule name"] or [rules name + form field name],
// e.g. 'netex.entur-codespace: code' or 'rule-netex.entur: true'
export interface FormData extends Map {
  url?: string
  name?: string | undefined
  format?: string
  businessId?: string
  etag?: string | undefined
  context?: string | undefined
  credentials?: string | undefined
}

// Map covers the dynamic fields coming from [rule name] or [rules name + form field name],
// e.g. 'netex.entur-codespace: error text'
export interface FormError extends Map {
  businessId?: string | undefined
  url?: string | undefined
  format?: string | undefined
  rulesRequired?: string | undefined
}

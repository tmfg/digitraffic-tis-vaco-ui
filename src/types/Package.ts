import { Links } from './Link'

export interface PackageResource {
  data: { name: string }
  error?: string
  links: Links
}

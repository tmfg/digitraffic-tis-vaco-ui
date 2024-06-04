import { Ruleset } from './Ruleset'
import { Context } from './Context'

export interface Company {
  businessId: string
  language?: string
  name: string
  adGroupId?: string
  contactEmails?: string[]
  formatSummary?: string
  publish: boolean
  codespaces?: string[]
}

export interface CompaniesResource {
  data: {
    companies: Company[]
  }
}

export interface CompanyResource {
  data: Company
}

export interface CompanyInfoResource {
  data: {
    company: Company
    contexts: Context[]
    hierarchies: CompanyHierarchy[]
    rulesets: Ruleset[]
  }
}

export interface CompanyHierarchy {
  company: Company
  children: CompanyHierarchy[]
}

export interface SwapPartnershipRequest {
  oldPartnerABusinessId: string | undefined
  newPartnerABusinessId: string | undefined
  partnerBBusinessId: string
}

export interface CreatePartnershipRequest {
  //type: string
  partnerABusinessId: string
  partnerBBusinessId: string
}

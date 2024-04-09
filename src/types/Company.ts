import { Ruleset } from './Ruleset'

export interface Company {
  businessId: string
  language?: string
  name: string
  adGroupId?: string
  contactEmails?: string[]
  formatSummary?: string
  publish: boolean
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

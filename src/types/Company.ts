export interface Company {
  businessId: string
  language: string
  name: string
}

export interface CompanyResource {
  data: {
    companies: Company[]
  }
}

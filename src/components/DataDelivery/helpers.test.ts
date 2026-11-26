import { describe, it, expect } from 'vitest'
import { TFunction } from 'i18next'
import { getTableRow } from './helpers'
import { CompanyLatestEntryResource } from '../../types/DataDelivery'

const t = ((key: string) => key) as unknown as TFunction<'translation', undefined>

describe('Data delivery table row', () => {
  it('links the company name to the company entries page without a query string', () => {
    const resource: CompanyLatestEntryResource = {
      data: {
        companyName: 'Foreign Oy',
        businessId: '3333333-3',
        publicId: null,
        context: null,
        url: null,
        format: null,
        convertedFormat: null,
        status: null,
        created: null
      },
      links: { refs: {} }
    }

    const companyCell = getTableRow(resource, t)[0]

    expect(companyCell.href).toBe('/data/companies/3333333-3')
  })
})

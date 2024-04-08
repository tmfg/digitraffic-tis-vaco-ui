import { TFunction } from 'i18next'
import { PublicValidationTest } from '../types/PublicValidationTest'

export const getCompanyFullName = (
  companyName: string | null,
  businessId: string | undefined,
  t: TFunction<'translation', undefined>
) => {
  return companyName !== PublicValidationTest.companyName
    ? `${companyName} (${businessId})`
    : t('publicValidationTest:companyName')
}

export const getCompanyName = (companyName: string | undefined, t: TFunction<'translation', undefined>) => {
  return companyName !== PublicValidationTest.companyName ? companyName : t('publicValidationTest:companyName')
}

export const getBusinessId = (businessId: string) => {
  return businessId !== PublicValidationTest.businessId ? businessId : ''
}

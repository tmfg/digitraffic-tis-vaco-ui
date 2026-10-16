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

const BUSINESS_ID_FORMAT = /^\d{7}-\d$/

const BUSINESS_ID_WEIGHTS = [7, 9, 10, 5, 8, 4, 2]

export const isValidBusinessId = (businessId: string) => {
  if (!BUSINESS_ID_FORMAT.test(businessId)) {
    return false
  }
  const sum = BUSINESS_ID_WEIGHTS.reduce((acc, weight, i) => acc + Number(businessId[i]) * weight, 0)
  const remainder = sum % 11
  if (remainder === 1) {
    return false
  }
  return Number(businessId[8]) === (remainder === 0 ? 0 : 11 - remainder)
}

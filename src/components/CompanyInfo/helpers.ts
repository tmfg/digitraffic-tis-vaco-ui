import { TFunction } from 'i18next'
import { HeaderItem, TableItem } from '../Common/Table/Table'
import { Ruleset } from '../../types/Ruleset'
import { Map } from '../../types/Map'
import { InteractionStatus, IPublicClientApplication } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { Company, CompanyHierarchy } from '../../types/Company'

export const getRulesetTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'format',
      value: t('admin:ruleset:format'),
      colSpan: 1,
      sortable: true,
      type: 'string'
    },
    {
      name: 'name',
      value: t('admin:ruleset:name'),
      colSpan: 1
    },
    {
      name: 'description',
      value: t('admin:ruleset:description'),
      colSpan: 2
    },
    {
      name: 'category',
      value: t('admin:ruleset:category'),
      colSpan: 1
    },
    {
      name: 'type',
      value: t('admin:ruleset:type'),
      colSpan: 1
    } /*,
    {
      name: 'dependencies',
      value: t('admin:ruleset:dependencies'),
      colSpan: 1
    }*/
  ]
}

export const getRulesetTableRow = (ruleset: Ruleset, t: TFunction<'translation', undefined>): TableItem[] => {
  return [
    {
      name: 'format',
      value: t('format:' + ruleset.format.toLowerCase()),
      colSpan: 1,
      plainValue: ruleset.format
    },
    {
      name: 'identifyingName',
      value: ruleset.identifyingName,
      colSpan: 1,
      plainValue: ruleset.identifyingName
    },
    {
      name: 'description',
      value: ruleset.description,
      colSpan: 2,
      plainValue: ruleset.description
    },
    {
      name: 'category',
      value: ruleset.category,
      plainValue: ruleset.category,
      colSpan: 1
    },
    {
      name: 'type',
      value: ruleset.type,
      colSpan: 1,
      plainValue: ruleset.type
    } /*,
    {
      name: 'dependencies',
      value: ruleset.dependencies.join(', '),
      colSpan: 1,
      plainValue: ruleset.dependencies.join(', '),
    }*/
  ]
}

export const getCompanyInfoKeyValuePairs = (company: Company, t: TFunction<'translation', undefined>) => {
  return [
    {
      label: t('admin:company:name'),
      value: company.name
    },
    {
      label: t('admin:company:businessId'),
      value: company.businessId
    },
    {
      label: t('admin:company:language'),
      value: company.language
    },
    {
      label: t('admin:company:adGroupId'),
      value: company.adGroupId
    },
    {
      label: t('admin:company:contactEmails'),
      value: company.contactEmails?.join(', ')
    }
  ]
}

export const validateFormData = (formData: Map, translate: TFunction<'translation', undefined>) => {
  const errors: Map = {}

  if (!formData.name) {
    errors.name = translate('services:testData:form:formatRequired')
  }

  if (!formData.businessId) {
    errors.businessId = translate('services:testData:form:companyRequired')
  }

  return errors
}

export const submitCompanyData = async (
  instance: IPublicClientApplication,
  inProgress: InteractionStatus,
  formData: Map,
  setFormErrors: (err: Map) => void,
  onEditCompanyCallback: (c: Company) => void,
  onEditHierarchiesCallback: (h: CompanyHierarchy[]) => void,
  setIsEditing: (status: boolean) => void,
  translate: TFunction<'translation', undefined>,
  currentBusinessId: string
) => {
  const tokenResult = await acquireToken(instance, inProgress)
  if (!tokenResult) {
    // TODO: At some point, show some error notification
    return
  }

  const errors = validateFormData(formData, translate)
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    return
  }

  const requestBody: Company = {
    name: formData.name as string,
    businessId: formData.businessId as string,
    language: formData.language as string,
    adGroupId: formData.adGroupId as string,
    contactEmails: (formData.contactEmails as string)?.split(/\s*,\s*/)
  }

  const { data } = await HttpClient.put(
    '/api/ui/admin/companies/' + currentBusinessId,
    requestBody,
    getHeaders(tokenResult.accessToken)
  )

  onEditCompanyCallback(data.data.company as Company)
  onEditHierarchiesCallback(data.data.hierarchies as CompanyHierarchy[])
  setIsEditing(false)
}

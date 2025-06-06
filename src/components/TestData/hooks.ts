import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { RulesetResource, RulesetType } from '../../types/Ruleset'
import { parseJwt } from '../../util/jwt'
import { useMsal } from '@azure/msal-react'
import { getUniqueValues } from '../../util/array'
import { Context, ContextResource } from '../../types/Context'

export const useCompanyRulesFetch = (selectedBusinessId: string | undefined, accessToken: string | null) => {
  const [validationRules, setValidationRules] = useState<RulesetResource[]>([])
  const [conversionRules, setConversionRules] = useState<RulesetResource[]>([])
  const [formats, setFormats] = useState<string[]>([])
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    if (accessToken && selectedBusinessId) {
      setIsFetchInProgress(true)
      HttpClient.get(`/api/ui/rules?businessId=${selectedBusinessId}`, getHeaders(accessToken)).then(
        (response) => {
          setIsFetchInProgress(false)
          const companyRules = response.data as RulesetResource[]
          const availableValidationRules = companyRules.filter((rule) => rule.data.type === RulesetType.ValidationSyntax)
          setValidationRules(availableValidationRules)
          const availableConversionRules = companyRules.filter((rule) => rule.data.type === RulesetType.ConversionSyntax)
          setConversionRules(availableConversionRules)
          const availableFormats = getUniqueValues(availableValidationRules.map((rule) => rule.data.format)).sort()
          setFormats(availableFormats)
        },
        (error) => {
          setIsFetchInProgress(false)
          return Promise.reject(error)
        }
      )
    }
  }, [accessToken, selectedBusinessId])

  return [formats, validationRules, conversionRules, isFetchInProgress] as const
}

export const useCompanyContextsFetch = (selectedBusinessId: string | undefined, accessToken: string | null) => {
  const [contexts, setContexts] = useState<Context[]>([])
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    if (accessToken && selectedBusinessId) {
      setIsFetchInProgress(true)
      HttpClient.get(`/api/ui/contexts?businessId=${selectedBusinessId}`, getHeaders(accessToken)).then(
        (response) => {
          setIsFetchInProgress(false)
          const contextData = response.data as ContextResource[]
          setContexts(contextData.map((context) => context.data))
        },
        (error) => {
          setIsFetchInProgress(false)
          return Promise.reject(error)
        }
      )
    }
  }, [accessToken, selectedBusinessId])

  return [contexts, isFetchInProgress] as const
}

export const useRulesForFormat = (selectedFormat: string | undefined, availableRules: RulesetResource[]) => {
  const [rulesForFormat, setRulesForFormat] = useState<RulesetResource[]>([])

  useEffect(() => {
    if (selectedFormat) {
      setRulesForFormat(
        availableRules.filter((rule) => rule.data.format.toLowerCase() === selectedFormat.toLowerCase())
      )
    }
  }, [selectedFormat, availableRules])

  return [rulesForFormat] as const
}

export const useUserEmail = (accessToken: string | null) => {
  const { instance } = useMsal()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    if (!accessToken) {
      return
    }
    // Set email from token's claim or if not found - from account's username
    const jwtObject = parseJwt(accessToken)
    if (jwtObject && jwtObject.email) {
      setEmail(jwtObject.email)
    } else {
      const account = instance.getActiveAccount()
      if (account && account.username && account.username.includes('@') && !account.username.startsWith('@')) {
        setEmail(account.username)
      }
    }
  }, [accessToken, instance])

  return [email] as const
}

import './_report.scss'
import { RuleReport } from '../../../types/EntryStateResource'
import PackageButton from '../PackageButton'
import { useTranslation } from 'react-i18next'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../../Common/KeyValuePairs/KeyValuePairs'
import { useIsAuthenticated } from '@azure/msal-react'

interface ConversionReportProps {
  report: RuleReport
}

const ConversionReport = ({ report }: ConversionReportProps) => {
  const { t } = useTranslation()
  const isAuthenticated = useIsAuthenticated()
  const header: KeyValuePairItem[] = [
    {
      label: t('services:processingResults:conversionRule'),
      value: report.ruleDescription
    }
  ]
  return (
    <div className={'report-container'}>
      <div className={'packages-container'}>
        <KeyValuePairs items={header} variant={KeyValuePairVariant.bigger} />
        {isAuthenticated && (
          <>
            <br />
            <h5>{t('services:processingResults:packages:header')}</h5>
            <div>
              {report.packages.map((p) => {
                return <PackageButton key={'package-' + p.data.name} entryPackage={p} />
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ConversionReport

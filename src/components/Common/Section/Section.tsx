import { useTranslation } from 'react-i18next'
import React, { useContext, useState } from 'react'
import { FdsIconComponent } from '../../fds/FdsIconComponent'
import './_section.scss'
import { EntryContext } from '../../../pages/ProcessingResults/ProcessingResultsPage.tsx'
import { ReportContext } from '../../ProcessingResults/report/Report.tsx'
import VacoBadge from '../VacoBadge/VacoBadge.tsx'
import { EnvironmentContext } from '../../../EnvironmentProvider.tsx'

interface SectionProps {
  titleKey: string
  children?: React.ReactNode
  hidable: boolean
}

const Section = ({ titleKey, children, hidable }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const { t } = useTranslation()

  const bootstrap = useContext(EnvironmentContext)
  const entry = useContext(EntryContext)
  const ruleReport = useContext(ReportContext)

  return (
    <section>
      <header>
        <h2>{t(titleKey)}</h2>
        {bootstrap && entry && ruleReport && (
          <VacoBadge bootstrap={bootstrap} publicId={entry.publicId} taskName={ruleReport.ruleName} />
        )}
        {hidable && (
          <span className={'hide-control'} onClick={() => setIsOpen(!isOpen)}>
            <span className={'text'}>{t('services:processingResults:' + (isOpen ? 'hide' : 'show'))}</span>
            <FdsIconComponent className={'icon'} icon={!isOpen ? 'chevron-down' : 'chevron-up'} />
          </span>
        )}
      </header>

      <div>{isOpen && children}</div>
    </section>
  )
}

export default Section

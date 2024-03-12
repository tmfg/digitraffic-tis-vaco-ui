import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { FdsIconComponent } from '../../fds/FdsIconComponent'
import './_section.scss'

interface SectionProps {
  titleKey: string
  children?: React.ReactNode
  hidable: boolean
}

const Section = ({ titleKey, children, hidable }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const { t } = useTranslation()

  return (
    <section>
      <header>
        <h2>{t(titleKey)}</h2>
        {hidable && (
          <span className={'hide-control'} onClick={() => setIsOpen(!isOpen)}>
            <span className={'text'}>{t('services:processingResults:' + (isOpen ? 'hide' : 'show'))}</span>
            <FdsIconComponent icon={!isOpen ? 'chevron-down' : 'chevron-up'} />
          </span>
        )}
      </header>

      <div>{isOpen && children}</div>
    </section>
  )
}

export default Section

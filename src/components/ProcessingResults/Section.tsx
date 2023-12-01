import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { FdsIconComponent } from '../fds/FdsIconComponent'
import './_section.scss'

interface SectionProps {
  titleKey: string
  children?: React.ReactNode
}

const Section = ({ titleKey, children }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const { t } = useTranslation()

  return (
    <div className={'section'}>
      <div className={'header'}>
        <h3>{t('services:processingResults:' + titleKey)}</h3>
        <span className={'hide-control'} onClick={() => setIsOpen(!isOpen)}>
          <span className={'text'}>
            {t('services:processingResults:' + (isOpen ? 'hide' : 'show'))}
          </span>
          <span className={'icon'}>
            <FdsIconComponent icon={isOpen ? 'chevron-down' : 'chevron-up'} />
          </span>
        </span>
      </div>

      <div>{isOpen && children}</div>
    </div>
  )
}

export default Section
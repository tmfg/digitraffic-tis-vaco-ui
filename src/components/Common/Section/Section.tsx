import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { FdsIconComponent } from '../../fds/FdsIconComponent'
import './_section.scss'

interface SectionProps {
  titleKey: string
  children?: React.ReactNode
  hidable: boolean
  badge?: React.ReactNode
  isOpenByDefault?: boolean
}

/**
 * Generic section component
 */
const Section = ({ titleKey, children, hidable, isOpenByDefault = true, badge }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault)
  const { t, i18n } = useTranslation()

  return (
    <section>
      <header>
        <h2>{i18n.exists(titleKey) ? t(titleKey) : titleKey}</h2>
        {badge || ''}
        {hidable && (
          <span className={'hide-control'} onClick={() => setIsOpen(!isOpen)}>
            <span className={'text'}>{t('common:section.' + (isOpen ? 'hide' : 'show'))}</span>
            <FdsIconComponent className={'icon'} icon={!isOpen ? 'chevron-down' : 'chevron-up'} />
          </span>
        )}
      </header>

      <div>{isOpen && children}</div>
    </section>
  )
}

export default Section

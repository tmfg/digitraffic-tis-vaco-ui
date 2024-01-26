import './_summary.scss'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../../Common/KeyValuePairs/KeyValuePairs'
import { SummaryCard, SummaryItem } from './types'
import { useTranslation } from 'react-i18next'
import Card from '../../Common/Card/Card'
import { Map } from '../../../types/Map'
import { useState } from 'react'
import { FdsIconComponent } from '../../fds/FdsIconComponent'

interface SummaryProps {
  summaries: SummaryItem[]
}

const Summary = ({ summaries }: SummaryProps) => {
  const { t } = useTranslation()
  const [showAllStates, setShowAllStates] = useState<Map>({})

  const getSummaryContent = (summary: SummaryItem) => {
    if (summary.rendererType === 'CARD') {
      const cards: SummaryCard[] = summary.content as SummaryCard[]
      const shownCards = cards.length > 4 ? (showAllStates[summary.name] ? cards : cards.slice(0, 4)) : cards
      return (
        <>
          {shownCards.map((card, index) => {
            const cardContent: KeyValuePairItem[] = card.content
            if (cardContent) {
              const localized: KeyValuePairItem[] = cardContent.map((pair) => {
                return {
                  label: t('services:processingResults:summaries:' + pair.label),
                  value: pair.value,
                  isUrl: pair.label === 'website' || pair.label === 'url'
                }
              })
              return (
                <Card key={'card-' + card.title + index} title={card.title}>
                  <KeyValuePairs items={localized} variant={KeyValuePairVariant.small} />
                </Card>
              )
            }
          })}
          {cards.length > 4 && (
            <span
              className={'hide-control'}
              onClick={() => {
                const currentShowAllStates = { ...showAllStates }
                currentShowAllStates[summary.name] = !showAllStates[summary.name]
                setShowAllStates(currentShowAllStates)
              }}
            >
              <span className={'text'}>
                {showAllStates[summary.name]
                  ? t('common:showLess', {
                      values: t('services:processingResults:summaries:showLessItem:' + summary.name)
                    })
                  : t('common:showAll', {
                      values: t('services:processingResults:summaries:showAllItem:' + summary.name)
                    })}
              </span>
              <span className={'icon'}>
                <FdsIconComponent icon={showAllStates[summary.name] ? 'chevron-up' : 'chevron-down'} />
              </span>
            </span>
          )}
        </>
      )
    } else if (summary.rendererType === 'TABULAR') {
      const pairs: KeyValuePairItem[] = summary.content as KeyValuePairItem[]
      const localized: KeyValuePairItem[] = pairs.map((pair) => {
        return {
          label: t('services:processingResults:summaries:' + pair.label),
          value: pair.value
        }
      })
      return <KeyValuePairs items={localized} variant={KeyValuePairVariant.small} />
    } else if (summary.rendererType === 'LIST') {
      const list: string[] = summary.content as string[]
      const shownItems = list.length > 13 ? (showAllStates[summary.name] ? list : list.slice(0, 13)) : list
      const sortedList = shownItems?.sort((a, b) => a.localeCompare(b))
      return (
        <>
          {sortedList?.map((item) => <div style={{ marginBottom: '3px' }} key={summary.name + '-content-' + item}> {item}</div>)}
          {list.length > 13 && (
            <span
              style={{ marginTop: '0.7rem' }}
              className={'hide-control'}
              onClick={() => {
                const currentShowAllStates = { ...showAllStates }
                currentShowAllStates[summary.name] = !showAllStates[summary.name]
                setShowAllStates(currentShowAllStates)
              }}
            >
              <span className={'text'}>
                {showAllStates[summary.name]
                  ? t('common:showLess', {
                      values: t('services:processingResults:summaries:showLessItem:' + summary.name)
                    })
                  : t('common:showAll', {
                      values: t('services:processingResults:summaries:showAllItem:' + summary.name)
                    })}
              </span>
              <span className={'icon'}>
                <FdsIconComponent icon={showAllStates[summary.name] ? 'chevron-up' : 'chevron-down'} />
              </span>
            </span>
          )}
        </>
      )
    }
  }

  return (
    <div className={'entry-summary'}>
      <div className={'summary-header'}>
        {summaries.map((summary) => (
          <div key={'summary-header-' + summary.name} className={'col'}>
            {t('services:processingResults:summaries:' + summary.name)}
          </div>
        ))}
      </div>
      <div className={'summary-row'}>
        {summaries.map((summary) => (
          <div key={'summary-content-' + summary.name} className={'col'}>
            {getSummaryContent(summary)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Summary

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
    if (summary.type === 'cards') {
      const cards: SummaryCard[] = summary.content as SummaryCard[]
      /* if (cards.length > 3) {
        const currentShowAllStates = { ...showAllStates }
        currentShowAllStates[summary.title] = false
        setShowAllStates(currentShowAllStates)
      }*/
      const shownCards = cards.length > 3 ? (showAllStates[summary.title] ? cards : cards.slice(0, 3)) : cards
      return (
        <div>
          {shownCards.map((card) => {
            const cardContent: KeyValuePairItem[] = card.content
            return (
              <Card key={'card-' + card.title} title={card.title}>
                <KeyValuePairs items={cardContent} variant={KeyValuePairVariant.small} />
              </Card>
            )
          })}
          {cards.length > 3 && (
            <span
              className={'hide-control'}
              onClick={() => {
                const currentShowAllStates = { ...showAllStates }
                currentShowAllStates[summary.title] = !showAllStates[summary.title]
                setShowAllStates(currentShowAllStates)
              }}
            >
              <span className={'text'}>
                {showAllStates[summary.title] ? 'Show less ' + summary.title : 'Show all ' + summary.title}
              </span>
              <span className={'icon'}>
                <FdsIconComponent icon={showAllStates[summary.title] ? 'chevron-up' : 'chevron-down'} />
              </span>
            </span>
          )}
        </div>
      )
    } else if (summary.type === 'tabular') {
      const pairs: KeyValuePairItem[] = summary.content as KeyValuePairItem[]
      const localized: KeyValuePairItem[] = pairs.map((pair) => {
        return {
          label: t('services:processingResults:summaries:' + pair.label),
          value: pair.value
        }
      })
      return <KeyValuePairs items={localized} variant={KeyValuePairVariant.small} />
    } else if (summary.type === 'list') {
      const list: string[] = summary.content as string[]
      const sortedList = list.sort((a, b) => a.localeCompare(b))
      return sortedList.map((item) => <div key={summary.title + '-content-' + item}> {item}</div>)
    }
  }

  return (
    <table className={'entry-summary'}>
      <header>
        {summaries.map((summary) => (
          <div key={'summary-header-' + summary.title} className={'col'}>
            {t('services:processingResults:summaries:' + summary.title)}
          </div>
        ))}
      </header>
      <div className={'row'}>
        {summaries.map((summary) => (
          <div key={'summary-content-' + summary.title} className={'col'}>
            {getSummaryContent(summary)}
          </div>
        ))}
      </div>
    </table>
  )
}

export default Summary

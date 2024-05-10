import Section from '../Common/Section/Section'
import Table, { HeaderItem, TableItem } from '../Common/Table/Table'
import { Ruleset } from '../../types/Ruleset'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRulesetTableHeaders, getRulesetTableRow } from './helpers'

interface RulesetsProps {
  rulesets: Ruleset[]
}

const Rulesets = ({ rulesets }: RulesetsProps) => {
  const { t } = useTranslation()
  const headerItems: HeaderItem[] = getRulesetTableHeaders(t)
  const [rulesetRows, setRulesetRows] = useState<TableItem[][]>([])

  useEffect(() => {
    if (rulesets) {
      const rows: TableItem[][] = rulesets.map((ruleset: Ruleset) => {
        return getRulesetTableRow(ruleset, t)
      })
      setRulesetRows(rows)
    }
  }, [rulesets, t])

  return (
    <Section titleKey={'admin:company:rulesets'} hidable={true}>
      <Table
        tableTitle={'rulesets'}
        headerItems={headerItems}
        rows={rulesetRows}
        isFixedLayout={false}
        defaultSortedColumn={{ name: 'format', direction: 'ASC', type: 'string' }}
      />
    </Section>
  )
}

export default Rulesets

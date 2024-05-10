import { Context } from '../../types/Context'
import Table, { HeaderItem, TableItem } from '../Common/Table/Table'
import { getContextTableHeaders } from './helpers'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import Section from '../Common/Section/Section'
import { ContextButton } from './ContextButton'

interface ContextProps {
  contexts: Context[]
  businessId: string
}

const Contexts = ({ contexts, businessId }: ContextProps) => {
  const { t } = useTranslation()
  const [contextData, setContextData] = useState<Context[]>(contexts)
  const headerItems: HeaderItem[] = getContextTableHeaders(t)
  const getContextTableRow = (context: Context): TableItem[] => {
    return [
      {
        name: 'context',
        value: context.context,
        colSpan: 4,
        plainValue: context.context
      },
      {
        name: 'edit',
        value: (
          <ContextButton
            updateContextsCallback={setContextData}
            context={context.context}
            businessId={context.businessId}
          />
        ),
        colSpan: 1,
        plainValue: '',
        textAlign: 'right'
      }
    ]
  }

  const [contextRows, setContextRows] = useState<TableItem[][]>([])
  useEffect(() => {
    setContextRows(
      contextData.map((context: Context) => {
        return getContextTableRow(context)
      })
    )
  }, [contextData])

  return (
    <Section titleKey={'admin:company.contexts'} hidable={true}>
      <div style={{ width: '46rem' }}>
        <Table
          tableTitle={'contexts'}
          headerItems={headerItems}
          rows={contextRows}
          isFixedLayout={true}
          isHalfWide={true}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <ContextButton updateContextsCallback={setContextData} context={null} businessId={businessId} />
      </div>
    </Section>
  )
}

export default Contexts

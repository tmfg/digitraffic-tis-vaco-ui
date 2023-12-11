import { Notice } from '../../../types/EntryStateResource'
import { useTranslation } from 'react-i18next'
import { getNoticesTableHeaders } from './helpers'
import Table, { HeaderItem, TableItem } from '../../Common/Table/Table'
import { ReactComponent as ErrorSvg } from '../../../assets/svg/error.svg'
import { ReactComponent as WarningSvg } from '../../../assets/svg/warning.svg'
import { ReactComponent as InfoSvg } from '../../../assets/svg/info.svg'
import React from 'react'
import NoticeDetails from './NoticeDetails'

interface NoticesTableProps {
  notices: Notice[]
}

const NoticesTable = ({ notices }: NoticesTableProps) => {
  const { t } = useTranslation()
  const headerItems: HeaderItem[] = getNoticesTableHeaders(t)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return <ErrorSvg />
      case 'WARNING':
        return <WarningSvg />
      case 'INFO':
        return <InfoSvg />
      default:
        return <InfoSvg />
    }
  }

  const noticesRowItems: TableItem[][] = notices.map((notice: Notice) => {
    return [
      {
        name: 'code',
        value: notice.code
      },
      {
        name: 'feedName',
        value: (
          <div className={notice.severity}>
            {getSeverityIcon(notice.severity)} {'  '}
            <span className={notice.severity + '--text'} style={{ marginLeft: '5px' }}>
              {t('services:processingResults:severity:' + notice.severity.toLowerCase())}
            </span>
          </div>
        ),
        plainValue: notice.severity
      },
      {
        name: 'total',
        value: notice.total
      }
    ]
  })

  const expandables: React.ReactNode[] = notices.map((notice: Notice) => {
    return <NoticeDetails key={'notice-details-' + notice.code} notice={notice} />
  })

  return (
    <>
      <Table
        tableTitle={''}
        headerItems={headerItems}
        rows={noticesRowItems}
        rowExpandable={true}
        rowExpandedContents={expandables}
      />
    </>
  )
}

export default NoticesTable

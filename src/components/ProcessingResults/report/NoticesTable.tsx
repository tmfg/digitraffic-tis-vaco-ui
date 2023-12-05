import { Notice } from '../../../types/EntryStateResource'
import { useTranslation } from 'react-i18next'
import { getNoticesTableHeaders } from './helpers'
import Table, { HeaderItem, TableItem } from '../../Common/Table/Table'
import { ReactComponent as ExpandSvg } from '../../../assets/svg/plus.svg'
import { ReactComponent as ErrorSvg } from '../../../assets/svg/error.svg'
import { ReactComponent as WarningSvg } from '../../../assets/svg/warning.svg'
import { ReactComponent as InfoSvg } from '../../../assets/svg/info.svg'
import { Error as NoticeInstance } from '../../../types/Error'
import React from 'react'

interface NoticesTableProps {
  notices: Notice[]
}

const NoticesTable = ({ notices }: NoticesTableProps) => {
  const { t } = useTranslation()
  const headerItems = getNoticesTableHeaders(t)
  /* const rowActionButton: TableItem[] = [
    {
      name: 'action',
      value: <div>Yo</div>
    }
  ]*/

  const getNoticeInstancesTableHeader = (instances: NoticeInstance[]): HeaderItem[] => {
    const exampleInstance = JSON.parse(atob(instances[0].raw)) as object
    const keys = Object.keys(exampleInstance)
    return keys.map((key) => {
      return {
        name: key,
        value: key
      }
    })
  }

  const getNoticeInstancesList = (instances: NoticeInstance[]) => {
    const headers: HeaderItem[] = getNoticeInstancesTableHeader(instances)
    const rows: TableItem[][] = instances.map((instance) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jsonContent: any = JSON.parse(atob(instance.raw))

      return headers.map((header) => {
        return {
          name: header.name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          value: jsonContent[header.name] as string
        }
      })
    })

    return <Table tableTitle={''} headerItems={headers} rows={rows} />
  }

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
        value: (
          <div key={'notice.code'}>
            <ExpandSvg /> <span style={{ marginLeft: '5px' }}>{notice.code}</span>
          </div>
        ),
        plainValue: notice.code
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
    return (
      <td colSpan={3} key={'expanded-content-' + notice.code} className={'expanded-content'}>
        <div>
          <div style={{ marginBottom: '1rem' }}>
            You can see more about this notice{' '}
            <a
              target="_blank"
              href={'https://gtfs-validator.mobilitydata.org/rules.html#' + notice.code + '-rule'}
              rel="noreferrer"
            >
              here
            </a>
            .
          </div>

          <div style={{ marginBottom: '1rem' }}>{getNoticeInstancesList(notice.instances)}</div>
        </div>
      </td>
    )
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

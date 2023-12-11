import { Notice } from '../../../types/EntryStateResource'
import { Error as NoticeInstance } from '../../../types/Error'
import Table, { HeaderItem, TableItem } from '../../Common/Table/Table'
import { useTranslation } from 'react-i18next'
import { decodeBase64 } from '../../../util/base64'

interface NoticeDetailsProps {
  notice: Notice
}

const NoticeDetails = ({ notice }: NoticeDetailsProps) => {
  const { t } = useTranslation()

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
      const jsonContent: any = JSON.parse(decodeBase64(instance.raw))

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

  return (
    <td colSpan={3} key={'expanded-content-' + notice.code} className={'expanded-content'}>
      <div>
        <p>
          {t('services:processingResults:notices:moreInfo')}{' '}
          <a
            target="_blank"
            href={'https://gtfs-validator.mobilitydata.org/rules.html#' + notice.code + '-rule'}
            rel="noreferrer"
          >
            {t('common:here')}
          </a>
          .
        </p>

        {notice.instances.length < notice.total && (
          <p>
            {t('services:processingResults:notices:notAllNoticesShown', { instancesLength: notice.instances.length, noticeTotal: notice.total })}
          </p>
        )}

        <div style={{ marginBottom: '1rem' }}>{getNoticeInstancesList(notice.instances)}</div>
      </div>
    </td>
  )
}

export default NoticeDetails

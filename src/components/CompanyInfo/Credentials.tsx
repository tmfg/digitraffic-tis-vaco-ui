import { useTranslation } from 'react-i18next'
import Table, { HeaderItem, TableItem } from '../Common/Table/Table.tsx'
import { useEffect, useState } from 'react'
import Section from '../Common/Section/Section.tsx'
import i18n, { TFunction } from 'i18next'
import { Credential } from '../../types/Credential.ts'
import { useCredentialsApi } from '../../pages/AdminTools/Credentials/hooks.ts'
import { CredentialsButton } from './CredentialsButton.tsx'
import { FdsButtonComponent } from '../fds/FdsButtonComponent.ts'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button.ts'
import { Company } from '../../types/Company.ts'

interface CredentialsProps {
  owner: Company
  accessToken: string | null
}

const getCredentialsTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'name',
      value: t('admin:company.credentials.table.name'),
      colSpan: 2
    },
    {
      name: 'type',
      value: t('admin:company.credentials.table.type'),
      colSpan: 2
    },
    {
      name: 'Description',
      value: t('admin:company.credentials.table.description'),
      colSpan: 2
    },
    {
      name: "Url Pattern",
      value: t('admin:company.credentials.table.urlPattern'),
      colSpan: 2
    }
  ]
}

const Credentials = ({ accessToken, owner }: CredentialsProps) => {
  const { t } = useTranslation()
  const headerItems: HeaderItem[] = getCredentialsTableHeaders(t)
  const [credentials, reloadCredentials, deleteCredentials] = useCredentialsApi()

  useEffect(() => {
    if (accessToken) {
      reloadCredentials(owner, accessToken)
    }
  }, [accessToken])

  const getCredentialsTableRow = (credentials: Credential): TableItem[] => {
    return [
      {
        name:'name',
        value: credentials.name,
        colSpan: 2,
        plainValue: credentials.type
      },
      {
        name:'type',
        value: credentials.type,
        colSpan: 2,
        plainValue: credentials.type
      },
      {
        name:'description',
        value: credentials.description,
        colSpan: 2,
        plainValue: credentials.description
      },
      {
        name: 'urlPattern',
        value: credentials.urlPattern,
        colSpan: 2,
        plainValue: credentials.urlPattern
      },
      {
        name: 'edit',
        value: (
          <CredentialsButton
            updateCredentialsCallback={reloadCredentials}
            owner={owner}
            credential={credentials}
          />
        ),
        colSpan: 1,
        plainValue: '',
        textAlign: 'right'
      },
      {
        name: 'delete',
        value: (
          <FdsButtonComponent
            onClick={() => {
              deleteCredentials(credentials, accessToken).then(() => {
                reloadCredentials(owner, accessToken)
              })
            }}
            label={t('admin:company.credentials.actions.delete')}
            icon={'trash-2'}
            variant={FdsButtonVariant.danger}
          />
        ),
        colSpan: 1,
        plainValue: '',
        textAlign: 'right'
      }

    ]
  }

  const [credentialsRows, setCredentialsRows] = useState<TableItem[][]>([])
  useEffect(() => {
    if (credentials) {
      setCredentialsRows(
        credentials.map((credentials: Credential) => {
          return getCredentialsTableRow(credentials)
        })
      )
    }
  }, [credentials])

  return (
    <Section titleKey={'admin:company.credentials.section.title'} hidable={true}>
      {i18n.exists('admin:company.credentials.section.description') && (
        <div>{t('admin:company.credentials.section.description')}</div>
      )}
      <Table
        tableTitle={'credentials'}
        headerItems={headerItems}
        rows={credentialsRows}
        isFixedLayout={false}
        isHalfWide={false}
      />
      <div style={{ marginTop: '1rem' }}>
        <CredentialsButton
          updateCredentialsCallback={reloadCredentials}
          credential={undefined}
          owner={owner}
        />
      </div>
    </Section>
  )
}

export default Credentials

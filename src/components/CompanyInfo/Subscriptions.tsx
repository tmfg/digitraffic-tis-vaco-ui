import Table, { HeaderItem, TableItem } from '../Common/Table/Table'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import Section from '../Common/Section/Section'
import { Subscription } from '../../types/Subscription.ts'
import i18n, { TFunction } from 'i18next'
import { SubscriptionButton } from './SubscriptionButton.tsx'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button.ts'
import { FdsButtonComponent } from '../fds/FdsButtonComponent.ts'
import { useSubscriptionApi } from '../../pages/AdminTools/hooks.ts'

interface SubscriptionProps {
  businessId: string
  accessToken: string | null
}

const getSubscriptionTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'type',
      value: t('admin:company.subscriptions.table.type'),
      colSpan: 2
    },
    {
      name: 'resource',
      value: t('admin:company.subscriptions.table.resource'),
      colSpan: 3
    },
    {
      name: 'edit',
      value: '',
      colSpan: 1,
      textAlign: 'right'
    }
  ]
}

const Subscriptions = ({ accessToken, businessId }: SubscriptionProps) => {
  const { t } = useTranslation()
  const headerItems: HeaderItem[] = getSubscriptionTableHeaders(t)
  const [subscriptions, reloadSubscriptions, deleteSubscription] = useSubscriptionApi()

  useEffect(() => {
    if (accessToken) {
      reloadSubscriptions(businessId, accessToken)
    }
  }, [accessToken])

  const getSubscriptionTableRow = (subscription: Subscription): TableItem[] => {
    return [
      {
        name: 'type',
        value: subscription.type,
        colSpan: 2,
        plainValue: subscription.type
      },
      {
        name: 'resource',
        value: subscription.resource.name + ' (' + subscription.resource.businessId + ')',
        colSpan: 3,
        plainValue: subscription.resource.businessId
      },
      {
        name: 'delete',
        value: (
          <FdsButtonComponent
            onClick={() => {
              deleteSubscription(subscription, accessToken).then(() => {
                reloadSubscriptions(businessId, accessToken)
              })
            }}
            label={t('admin:company.subscriptions.actions.delete')}
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

  const [subscriptionRows, setContextRows] = useState<TableItem[][]>([])
  useEffect(() => {
    console.log('setting subscription rows' + JSON.stringify(subscriptions))
    if (subscriptions) {
      setContextRows(
        subscriptions.map((subscription: Subscription) => {
          return getSubscriptionTableRow(subscription)
        })
      )
    }
  }, [subscriptions])

  return (
    <Section titleKey={'admin:company.subscriptions.section.title'} hidable={true}>
      {i18n.exists('admin:company.subscriptions.section.description') && (
        <div>{t('admin:company.subscriptions.section.description')}</div>
      )}
      <Table
        tableTitle={'subscriptions'}
        headerItems={headerItems}
        rows={subscriptionRows}
        isFixedLayout={false}
        isHalfWide={false}
      />
      <div style={{ marginTop: '1rem' }}>
        <SubscriptionButton
          updateSubscriptionsCallback={reloadSubscriptions}
          subscription={null}
          businessId={businessId}
        />
      </div>
    </Section>
  )
}

export default Subscriptions

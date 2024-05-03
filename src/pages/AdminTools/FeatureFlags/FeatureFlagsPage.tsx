import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import AuthRequiredPage from "../../Error/AuthRequiredPage.tsx";
import { useAdminRightsCheck } from "../hooks.ts";
import { useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { usePageInit } from "../../../hooks/pageInit.ts";
import LoadSpinner from "../../../components/Common/LoadSpinner/LoadSpinner.tsx";
import { FeatureFlag } from "../../../types/FeatureFlag.ts";
import Table, { HeaderItem, TableItem } from "../../../components/Common/Table/Table.tsx";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../util/date.ts";
import { getHeaders, HttpClient } from "../../../HttpClient.ts";
import { useAcquireToken } from "../../../hooks/auth.ts";

type PageParams = {
}

const Checkbox = (props: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  label: string,
  value: boolean
}) => {
  return (<input
    type="checkbox"
    checked={props.value}
    onChange={props.onChange}
  />)
}

const FeatureFlagsPage = () => {
  const params = useParams<PageParams>();
  const [featureFlags, setFeatureFlags] = useState<Map<string, FeatureFlag>>(new Map<string, FeatureFlag>)
  const [rowItems, setRowItems] = useState<TableItem[][]>([])
  const [isFetchInProgress] = usePageInit<PageParams, FeatureFlag[]>('/api/feature-flags', params, (data) => {
    setFeatureFlags(data.reduce((agg, ff) => {
      agg.set(ff.name, ff)
      return agg
    }, new Map<string, FeatureFlag>()))
  })

  const { t } = useTranslation()
  const [accessToken] = useAcquireToken()
  const [hasAdminRole] = useAdminRightsCheck()

  const headerItems:HeaderItem[] = [
    {
      name: 'name',
      value: t('admin:featureFlags:table:name')
    },
    {
      name: 'modified',
      value: t('admin:featureFlags:table:modified')
    },
    {
      name: 'modifiedBy',
      value: t('admin:featureFlags:table:modifiedBy')
    },
    {
      name: 'enabled',
      value: t('admin:featureFlags:table:enabled')
    }
  ]

  useEffect(() => {
    const handleEnableChange = (name:string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (accessToken) {
        HttpClient.post(
          '/api/feature-flags/' + name + "/" + (event.target.checked ? 'enable' : 'disable'),
          {},
          getHeaders(accessToken)
        ).then(
          (response) => {
            featureFlags.set(name, response.data.data as FeatureFlag)
            setFeatureFlags(new Map<string,FeatureFlag>(featureFlags))
          },
          (error) => {
            // Show some error
            return Promise.reject(error)
          }
        )
      }
    }

    console.log('featureFlags changed, updating row items')
    setRowItems(Array.from(featureFlags.values()).map(ff => [
      {
        name: 'name',
        value: ff.name,
        colSpan: 1,
        plainValue: ff.name
      },{
        name: 'modified',
        value: formatDate(ff.modified),
        colSpan: 1,
        plainValue: ff.modified
      },{
        name: 'modifiedBy',
        value: ff.modifiedBy,
        colSpan: 1,
        plainValue: ff.modifiedBy
      }, {
        name: "enabled",
        value: <Checkbox
          label={"my value"}
          value={ff.enabled}
          onChange={handleEnableChange(ff.name)} />,
        colSpan: 1,
        plainValue: JSON.stringify(ff.name)
      }
    ]))
  }, [accessToken, featureFlags])

  return (<div className={'page-content'}>
    <AuthenticatedTemplate>
      {hasAdminRole && (
        <>
          <h1>{t('admin:featureFlags:header')}</h1>
          {isFetchInProgress && <LoadSpinner />}
          <Table
            tableTitle={'someTableTitle'}
            headerItems={headerItems}
            rows={rowItems}
          />
        </>)
      }
    </AuthenticatedTemplate>
    <UnauthenticatedTemplate>
      <AuthRequiredPage />
    </UnauthenticatedTemplate>
  </div>)
}

export default FeatureFlagsPage

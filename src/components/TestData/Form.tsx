import './form.scss'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { FdsCheckboxComponent } from '../fds/FdsCheckboxComponent'
import { FdsDropdownComponent } from '../fds/FdsDropdownComponent'
import { useState } from 'react'
import { EntryResource } from '../../types/EntryResource'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { acquireToken } from '../../hooks/auth'
import { EntryRequest } from './types'
import { getHeaders, HttpClient } from '../../HttpClient'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsDropdownOption } from '../../../coreui-components/src/fds-dropdown'

const Form = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const { instance } = useMsal()
  const { t } = useTranslation()
  const formats: FdsDropdownOption<string>[] = [
    { label: 'GTFS', value: 'gtfs' },
    { label: 'NeTEx', value: 'netex' }
  ]

  const submitTicket = async (e: MouseEvent) => {
    e.preventDefault()
    const tokenResult = await acquireToken(instance)
    if (!tokenResult) {
      // TODO: At some point, show some error notification
      return
    }

    const requestBody: EntryRequest = {
      url: 'https://tvv.fra1.digitaloceanspaces.com/249.zip',
      format: 'gtfs',
      businessId: '2942108-7',
      etag: 'etagg',
      validation: [
        {
          name: 'gtfs.canonical.v4_0_0',
          config: { lol: 'apua', muumi: 'pappa' }
        }
      ],
      metadata: {
        brewingEquipment: 'teapot',
        'capacity (ml)': 1500
      }
    }

    const { data } = await HttpClient.post('/api/queue', requestBody, getHeaders(tokenResult.idToken))
    setEntryResource(data as EntryResource)
  }

  return (
    <>
      {entryResource && <div>Future modal popup</div>}
      <h3>{t('services:testData:form:title')}</h3>
      <form>
        <div className={'form-section'}>
          <h5>{t('services:testData:form:section:basic')}</h5>

          <div className={'input-wrapper'}>
            <FdsInputComponent
              placeholder={t('services:testData:form:feedNamePlaceHolder')}
              label={t('services:testData:form:feedName')}
              message={t('services:testData:form:feedNameInfo')}
            />
          </div>

          <div className={'input-wrapper'}>
            <FdsInputComponent
              placeholder={'https://'}
              label={t('services:testData:form:url')}
              message={t('services:testData:form:urlInfo')}
            />
          </div>

          <div className={'input-wrapper etag'}>
            <FdsInputComponent label={t('services:testData:form:etag')} />
          </div>

          <div className={'input-wrapper format'}>
            <FdsDropdownComponent placeholder={'Choose'} label={t('services:testData:form:format')} options={formats} />
          </div>
        </div>

        <div className={'form-section'}>
          <h5>{t('services:testData:form:section:rules')}</h5>

          <div className={'input-wrapper'}>
            <FdsCheckboxComponent label={'gtfs.validator.v1'} />
          </div>
        </div>

        <div className={'form-section'}>
          <FdsButtonComponent onClick={submitTicket} label={t('services:testData:form:submit')} />
        </div>
      </form>
    </>
  )
}

export default Form

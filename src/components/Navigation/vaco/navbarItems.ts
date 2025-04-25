import { FdsIconType } from '../../../../coreui-components/src/fds-icon'
import { FdsNavigationItem, FdsNavigationItemPosition } from '../../../../coreui-components/src/fds-navigation'
import { TFunction } from 'i18next'
import { createAccount, login } from '../../../hooks/auth'

export const vacoItem = (): FdsNavigationItem => {
  return {
    label: 'VACO',
    value: '/',
    bold: true
  }
}

export const aboutItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: t('vaco:about'),
    value: '/about',
    dropDownItems: [
      {
        label: t('vaco:instructions'),
        value: 'https://www.fintraffic.fi/fi/fintraffic/validointi-ja-konvertointipalvelu',
        icon: 'external-link' as FdsIconType
      },
      {
        label: t('vaco:terms'),
        value: 'https://www.fintraffic.fi/fi/fintraffic/validointi-ja-konvertointipalvelu',
        icon: 'external-link' as FdsIconType
      },
      {
        label: t('vaco:privacy'),
        value: 'https://www.fintraffic.fi/fi/fintraffic/validointi-ja-konvertointipalvelu',
        icon: 'external-link' as FdsIconType
      }
    ]
  }
}

export const supportItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: t('vaco:support'),
    value: '',
    dropDownItems: [
      {
        label: t('vaco:channels'),
        value: 'https://www.fintraffic.fi/fi/fintraffic/validointi-ja-konvertointipalvelu',
        icon: 'external-link' as FdsIconType
      }
    ]
  }
}

export const myServicesItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: t('vaco:services'),
    value: '',
    dropDownItems: [
      {
        label: t('vaco:myData'),
        value: '/data'
      },
      {
        label: t('vaco:testData'),
        value: '/data/request'
      }
    ]
  }
}

export const adminToolsItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: t('admin:tools'),
    value: '',
    dropDownItems: [
      {
        label: t('admin:dataDelivery:header'),
        value: '/admin/data-delivery'
      },
      {
        label: t('admin:companies:header'),
        value: '/admin/companies'
      },
      {
        label: t('admin:featureFlags:header'),
        value: '/admin/feature-flags'
      },
      {
        label: t('admin:statistics:header'),
        value: 'admin/statistics'
      }
    ]
  }
}

export const userItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: '',
    value: '',
    position: FdsNavigationItemPosition.right,
    icon: 'user' as FdsIconType,
    dropDownItems: [
      {
        label: t('vaco:user'),
        value: '/user'
      }
    ]
  }
}

export const loginItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: t('vaco:login'),
    value: login,
    position: FdsNavigationItemPosition.right
  }
}

export const registerItem = (t: TFunction<'translation', undefined>): FdsNavigationItem => {
  return {
    label: t('vaco:register'),
    value: createAccount,
    position: FdsNavigationItemPosition.right
  }
}

export const localeItem = (): FdsNavigationItem => {
  return {
    label: '',
    value: '/locale',
    position: FdsNavigationItemPosition.right,
    icon: 'globe' as FdsIconType,
    dropDownItems: [
      {
        label: 'Suomeksi',
        value: '/locales/fi',
        isCheckable: true
      },
      {
        label: 'På Svenska',
        value: '/locales/sv',
        isCheckable: true
      },
      {
        label: 'In English',
        value: '/locales/en',
        isCheckable: true
      }
    ]
  }
}

export const getSelectedLocaleItem = (
  localeCode: string,
  translate: TFunction<'translation', undefined>
): FdsNavigationItem => {
  const selectedLocale: FdsNavigationItem = localeItem()
  selectedLocale.label = translate('locales:' + localeCode)
  selectedLocale.dropDownItems = localeItem().dropDownItems?.map((i: FdsNavigationItem) => {
    if ((i.value as string).includes(localeCode)) {
      i.icon = 'check' as FdsIconType
    } else {
      i.icon = undefined
    }
    return i
  }) as FdsNavigationItem[]

  return selectedLocale
}

import { Shortcut } from './types'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface ShortcutCardProps {
  item: Shortcut
}

const ShortcutCard = ({ item }: ShortcutCardProps) => {
  const { t } = useTranslation()

  return (
    <div className={'shortcut-card'}>
      <div className={'shortcut-card__icon'}>{item.icon}</div>
      <div>
        <div className={'shortcut-card__label'}>{item.label}</div>
        <div className={'shortcut-card__description'}>{item.description}</div>
        <Link
          to={item.to}
          onClick={(event) => {
            if (item.onClick) {
              event.preventDefault()
              item.onClick()
            }
          }}
        >
          {t('home:shortcut:navigate').toUpperCase()}
        </Link>
      </div>
    </div>
  )
}

export default ShortcutCard

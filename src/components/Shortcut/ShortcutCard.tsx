import { Shortcut } from './types'

interface ShortcutCardProps {
  item: Shortcut
}

const ShortcutCard = ({ item }: ShortcutCardProps) => {
  return (
    <div className={'shortcut-card'}>
      <div className={'shortcut-card__icon'}>{item.icon}</div>
      <div>
        <div className={'shortcut-card__label'}>{item.label}</div>
        <div className={'shortcut-card__description'}>{item.description}</div>
        <a
          href={item.to}
          onClick={(event) => {
            if (item.onClick) {
              event.preventDefault()
              item.onClick()
            }
          }}
        >
          NAVIGATE
        </a>
      </div>
    </div>
  )
}

export default ShortcutCard

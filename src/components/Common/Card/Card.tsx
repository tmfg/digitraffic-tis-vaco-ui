import './_card.scss'
import { isUrl } from '../../../util/url'
import React from 'react'

export interface CardItem {
  header?: string
  label: string
  value: string | number | React.ReactNode
}

interface CardProps {
  items: CardItem[]
  variant: CardVariant
}

export enum CardVariant {
  small = 'small',
  big = 'big'
}

const Card = ({ items, variant }: CardProps) => {
  const getValueElement = (value: string | number | React.ReactNode) => {
    if (!(typeof value === 'string')) {
      return value
    }

    if (isUrl(value)) {
      return <a href={value}>{value}</a>
    }
    return value
  }

  return (
    <div className={'card'}>

      <div className={'label-column-' + variant}>
        {items.map((item, i) => (
          <div className={'label'} key={'label-' + i + item.label}>
            {item.label}:
          </div>
        ))}
      </div>
      <div>
        {items.map((item, i) => (
          <div className={'value-' + variant} key={'value-' + i}>
            {item.value ? getValueElement(item.value) : '-'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Card

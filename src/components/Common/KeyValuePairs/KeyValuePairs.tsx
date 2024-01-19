import './_key_value_pair.scss'
import React from 'react'

export interface KeyValuePairItem {
  header?: string
  label: string
  value: string | number | React.ReactNode
  isUrl?: boolean
}

interface KeyValuePairProps {
  items: KeyValuePairItem[]
  variant: KeyValuePairVariant
}

export enum KeyValuePairVariant {
  small = 'small',
  big = 'big',
  bigger = 'bigger'
}

const KeyValuePairs = ({ items, variant }: KeyValuePairProps) => {
  const getValueElement = (isUrl: boolean | undefined, value: string | number | React.ReactNode) => {
    if (!(typeof value === 'string')) {
      return value
    }

    if (isUrl) {
      return <a href={value}>{value}</a>
    }
    return value
  }

  return (
    <div className={'keyvalue'}>
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
            {item.value ? getValueElement(item.isUrl, item.value) : '-'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyValuePairs

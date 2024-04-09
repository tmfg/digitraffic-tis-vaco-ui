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
    <div className={'keyvalue-table'}>
      {items.map((item) => (
        <div key={'keyvalue-row-' + item.label} className={'keyvalue-row'}>
          <span className={'key-' + variant}>{item.label} </span>
          <span className={'value value-' + variant}>{item.value ? getValueElement(item.isUrl, item.value) : '-'}</span>
        </div>
      ))}
    </div>
  )
}

export default KeyValuePairs

import { Bootstrap } from '../../../types/Bootstrap.ts'
import { CSSProperties } from 'react'

interface VacoBadgeProps {
  bootstrap: Bootstrap
  publicId: string
  taskName?: string
  style?: CSSProperties
}

const VacoBadge = ({ bootstrap, publicId, taskName, style }: VacoBadgeProps) => {
  return (
    <img style={style} alt={'badge'} src={bootstrap.baseUrl + '/api/badge/' + publicId + (taskName ? taskName : '')} />
  )
}

export default VacoBadge

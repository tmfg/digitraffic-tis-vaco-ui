import { ReactNode } from 'react'
import './_card.scss'

interface CardProps {
  title: string
  children: ReactNode
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className={'card'}>
      <div className={'title'}>{title}</div>
      <div className={'content'}>{children}</div>
    </div>
  )
}

export default Card

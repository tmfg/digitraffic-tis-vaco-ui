import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReactNode, createElement, useLayoutEffect, useRef } from 'react'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'

/**
 * Stand-in for FdsNavigationComponent. In jsdom the Lit wrapper left the element's items empty,
 * so this copies the items to a real fds-navigation element.
 */
export const FakeNavigation = ({ items }: { items: FdsNavigationItem[] }) => {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (ref.current) {
      ;(ref.current as unknown as { items: FdsNavigationItem[] }).items = items
    }
  })
  return createElement('fds-navigation', { ref })
}

/**
 * Renders the VACO navbar next to an empty bar 0, because Navbar finds its element by bar index.
 * The real Navbar is rendered, so the real language selection handler runs.
 */
export const renderWithBars = (ui: ReactNode) => {
  const firstBar = document.createElement('fds-navigation')
  document.body.appendChild(firstBar)
  const result = render(<MemoryRouter>{ui}</MemoryRouter>)
  const vacoBar = document.getElementsByTagName('fds-navigation')[1]
  return {
    ...result,
    vacoBar,
    cleanupBars: () => firstBar.remove()
  }
}

export const itemsOf = (bar: Element): FdsNavigationItem[] => (bar as unknown as { items: FdsNavigationItem[] }).items

export const selectLanguage = async (bar: Element, code: string) => {
  await act(async () => {
    bar.dispatchEvent(new CustomEvent('select', { detail: { value: '/locales/' + code, label: code } }))
    await Promise.resolve()
  })
}

export interface LabelNode {
  label: string
  children: LabelNode[]
}

export const labelTree = (items: FdsNavigationItem[]): LabelNode[] =>
  items.map((item) => ({ label: item.label, children: labelTree(item.dropDownItems ?? []) }))

export const checkedValues = (items: FdsNavigationItem[]): string[] =>
  items.flatMap((item) => [
    ...(item.icon === 'check' ? [String(item.value)] : []),
    ...checkedValues(item.dropDownItems ?? [])
  ])

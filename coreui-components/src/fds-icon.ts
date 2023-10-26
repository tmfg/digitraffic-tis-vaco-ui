import { FdsSizeToken, FdsTokenSize2 } from "../../coreui-css/lib";
import { css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  createElement,
  Menu,
  Plus,
  PlusCircle,
  Trash2,
  X,
  Settings,
  Pencil,
  CheckCircle,
  User,
  ExternalLink,
  Globe
} from 'lucide'

/**
 * Only the common icons needed in fds components are here to keep bundle size smaller
 */
export const FdsIcons = {
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  menu: Menu,
  pencil: Pencil,
  plus: Plus,
  'plus-circle': PlusCircle,
  'trash-2': Trash2,
  x: X,
  settings: Settings,
  'check-circle': CheckCircle,
  user: User,
  'external-link': ExternalLink,
  globe: Globe
}

export type FdsIconType = keyof typeof FdsIcons

/**
 * Add interactible icon element. Icon library: https://lucide.dev/
 *
 * @event click - Dispatches a MouseEvent on click.
 *
 * @property {string} icon - Options:
 * - alert-circle
 * - alert-triangle
 * - chevron-down
 * - chevron-right
 * - chevron-up
 * - menu
 * - edit
 * - plus-circle
 * - trash-2
 * - x
 * - settings
 * - check-circle
 * @property {string} size - FdsSizeToken
 */
@customElement('fds-icon')
export default class FdsIcon extends LitElement {
  @property() size: FdsSizeToken = FdsTokenSize2
  @property() icon?: FdsIconType

  override render(): SVGElement | null {
    if (!this.icon || !FdsIcons[this.icon]) {
      console.error(`invalid icon: '${this.icon}'`)
      return null
    }

    const svgElement = createElement(FdsIcons[this.icon])
    // Temporarily like this... For some reason setting props from fds-navigation doesn't seem to have an effect
    const size = this.icon.includes('chevron') ? '21px' : this.size.value
    svgElement.setAttribute('width', size)
    svgElement.setAttribute('height', size)
    return svgElement
  }

  static override styles = css`
    :host {
      display: inline-flex;
    }
  `
}

import {
  FdsColorBrandBlack,
  FdsColorBrandWhite,
  FdsColorText300,
  uiLabelTextClass,
} from '../../coreui-css/lib'
import { css, html, LitElement } from 'lit'
import { nothing, TemplateResult } from 'lit-html'
import { customElement, property } from 'lit/decorators.js'
import { FdsIconType } from './fds-icon'
import './global-types'

export enum FdsNavigationVariant {
  primary = 'primary',
  secondary = 'secondary',
}

export interface FdsNavigationItem {
  label: string
  value: unknown
  position?: FdsNavigationItemPosition
  icon?: FdsIconType
  bold?: boolean
}

export enum FdsNavigationItemPosition {
  left = 'left',
  right = 'right',
}
/**
 * Navigation component.
 *
 * @property {FdsNavigationVariant} variant - Primary or secondary style
 * @property {FdsNavigationItem[]} items - List of navigation items
 * @property {FdsNavigationItem} selected - Currently selected value
 * @event select - Triggered when destination is clicked. The selected item is in event details field.
 */

@customElement('fds-navigation')
export default class FdsNavigation extends LitElement {
  @property() variant: FdsNavigationVariant = FdsNavigationVariant.primary
  @property() items: FdsNavigationItem[] = []
  @property() selected?: FdsNavigationItem

  constructor() {
    super()

    this.addEventListener('externalNavigation', (e: Event) => {
      const selectedItem = (e as CustomEvent).detail as FdsNavigationItem
      const foundItem = this.items.find((i) => i.label === selectedItem.label)
      if (foundItem) {
        this.selected = foundItem
      }
    })
  }

  override render(): TemplateResult {
    const itemsOnRight = this.items.filter(item => item.position === FdsNavigationItemPosition.right)
    const itemsOnLeft = this.items.filter(item => item.position !== FdsNavigationItemPosition.right)
    return html`<div class="navigation navigation--${this.variant} ui-label-text">
      ${this.variant === FdsNavigationVariant.primary
        ? html`<div class="navigation__header">
            <slot></slot>
          </div>`
        : nothing}
      <div class="navigation__body">
        <div class="navigation__items">${itemsOnLeft.map(item => this.renderItem(item))}</div>
        <div class="navigation__items">${itemsOnRight.map(item => this.renderItem(item))}</div>
      </div>
    </div>`
  }

  renderItem(item: FdsNavigationItem): TemplateResult {
    return html` <div
      @click=${(): void => this.handleSelect(item)}
      class="item ${this.selected === item ? 'item--active' : ''}"
    >
      <div class="item__label ${item.bold ? 'item__label--bold' : ''}">
        ${item.icon && html`<fds-icon class="item__icon" .icon="${item.icon}"></fds-icon>`}
        <span>${item.label}</span>
      </div>
    </div>`
  }

  handleSelect(item: FdsNavigationItem): void {
    this.selected = item
    this.dispatchEvent(
      new CustomEvent<FdsNavigationItem>('select', {
        detail: item,
      })
    )
  }

  static override styles = [
    uiLabelTextClass,
    css`
      .navigation {
        display: flex;
        align-items: center;
        width: 100%;
        user-select: none;
      }

      .navigation__header ::slotted(*) {
        padding: 9px 24px 9px 32px;
      }

      .navigation__body {
        justify-content: space-between;
        width: 100%;
        height: 100%;
      }

      .navigation__items {
        align-items: end;
      }

      .navigation__header,
      .navigation__body,
      .navigation__items,
      .item__label {
        display: flex;
      }

      .item {
        cursor: pointer;
        display: grid;
        justify-items: center;
        grid-template-rows: auto 0;
        padding: 9px 20px;
      }

      .item__label {
        align-items: end;
      }

      .item__label--bold {
        font-weight: 700;
      }

      .item__icon {
        margin-right: 6px;
      }

      .navigation--primary {
        background-color: ${FdsColorBrandBlack};
        color: ${FdsColorBrandWhite};
        height: 40px;
      }

      .navigation--primary .item:hover {
        color: ${FdsColorText300};
      }

      .navigation--primary .item--active:after {
        content: '';
        position: relative;
        top: 1px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid ${FdsColorBrandWhite};
      }

      .navigation--secondary {
        background-color: ${FdsColorBrandWhite};
        border-bottom: 1px solid ${FdsColorBrandBlack};
        height: 55px;
      }

      .navigation--secondary .navigation__body {
        padding: 0px 16px;
      }

      .navigation--secondary .item {
        border-bottom: 3px solid white;
        padding: 16px 16px 13px 16px;
      }

      .navigation--secondary .item--active {
        border-bottom: 3px solid black;
      }

      .navigation--secondary .item:hover {
        color: ${FdsColorText300};
      }
    `,
  ]
}

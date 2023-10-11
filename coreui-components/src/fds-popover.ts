import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { TemplateResult } from 'lit-html'
import './fds-card'
import {
  FdsColorBrandWhite,
  FdsColorToken,
  FdsRadiusLarge,
  FdsStyleElevation200,
  FdsTokenColorBrandWhite,
  tokenVar,
  uiHelperTextClass,
} from '../../coreui-css/lib'
import { bottom, createPopper, Instance, left, Placement, right, top } from '@popperjs/core'

export enum FdsPopoverPosition {
  above = 'above',
  below = 'below',
  left = 'left',
  right = 'right',
}
/**
 * Popover component.
 *
 * @property {FdsPopoverPosition} position - Direction the popover opens
 * @property {boolean} openOnClick - Open popover by clicking
 * @property {FdsColorToken} backgroundColor - Popover background color
 */
@customElement('fds-popover')
export default class FdsPopover extends LitElement {
  @property() position: FdsPopoverPosition = FdsPopoverPosition.above
  @property() openOnClick: boolean = false
  @property() backgroundColor: FdsColorToken = FdsTokenColorBrandWhite

  @state() private _open: boolean = false
  private _popper?: Instance

  protected override updated(changed: PropertyValues<FdsPopover>): void {
    super.updated(changed)
    const child = this.shadowRoot?.children?.item(0) as HTMLElement
    if (!this._popper) {
      this._popper = createPopper(this.parentElement as HTMLElement, child, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
            enabled: true,
          },
        ],
        strategy: 'fixed',
        placement: fdsPlacement(this.position),
      })
      child.style.backgroundColor = tokenVar(this.backgroundColor).toString()
      this.addListeners()
    } else {
      if (changed.get('position')) {
        this._popper?.setOptions({
          placement: fdsPlacement(this.position),
        })
      }
      if (changed.get('openOnClick') != null) {
        this.removeListeners()
        this.addListeners()
      }
      if (changed.get('backgroundColor')) {
        child.style.backgroundColor = tokenVar(this.backgroundColor).toString()
      }
    }
    this._popper.update()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._popper?.destroy()
  }

  private addListeners(): void {
    if (this.openOnClick) {
      this.parentElement?.addEventListener('click', this._clickListener)
    } else {
      this.parentElement?.addEventListener('mouseenter', this._mouseEnterListener)
      this.parentElement?.addEventListener('mouseleave', this._mouseLeaveListener)
    }
  }

  private removeListeners(): void {
    this.parentElement?.removeEventListener('click', this._clickListener)
    this.parentElement?.removeEventListener('mouseenter', this._mouseEnterListener)
    this.parentElement?.removeEventListener('mouseleave', this._mouseLeaveListener)
  }

  private _clickListener: (event: MouseEvent) => void = () => {
    this._open = !this._open
  }

  private _mouseEnterListener: (event: MouseEvent) => void = () => {
    this._open = true
  }

  private _mouseLeaveListener: (event: MouseEvent) => void = () => {
    this._open = false
  }

  override render(): TemplateResult | null {
    return html`<div class="ui-helper-text popover${this._open ? ' popover-open' : ''}">
      <slot></slot>
      <div class="arrow" data-popper-arrow></div>
    </div>`
  }

  static override styles = [
    uiHelperTextClass,
    css`
      .popover {
        display: none;
        border-radius: ${FdsRadiusLarge};
        box-shadow: ${FdsStyleElevation200};
        background-color: ${FdsColorBrandWhite};
      }

      .popover-open {
        display: inline !important;
      }

      .arrow,
      .arrow::before {
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
      }

      .arrow {
        visibility: hidden;
      }

      .arrow::before {
        visibility: visible;
        content: '';
        transform: rotate(45deg);
      }

      .popover[data-popper-placement^='top'] > .arrow {
        bottom: -4px;
      }

      .popover[data-popper-placement^='bottom'] > .arrow {
        top: -4px;
      }

      .popover[data-popper-placement^='left'] > .arrow {
        right: -4px;
      }

      .popover[data-popper-placement^='right'] > .arrow {
        left: -4px;
      }
    `,
  ]
}

function fdsPlacement(position: FdsPopoverPosition): Placement {
  switch (position) {
    case FdsPopoverPosition.above:
      return top
    case FdsPopoverPosition.below:
      return bottom
    case FdsPopoverPosition.left:
      return left
    default:
      return right
  }
}

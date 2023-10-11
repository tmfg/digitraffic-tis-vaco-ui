import {
  FdsSize1,
  FdsSize2,
  FdsSize3,
  FdsSize4,
  FdsTokenStyleElevation100,
  FdsTokenStyleElevation200,
  headingSmall4TextClass
} from '../../coreui-css/lib'
import { css, html, LitElement } from 'lit'
import { TemplateResult } from 'lit-html'
import { customElement, property } from 'lit/decorators.js'
import './global-types'

export enum FdsCardElevation {
  none = 'none',
  low = 'low',
  high = 'high',
}

/**
 * Card component.
 *
 * @property {FdsCardElevation} elevation - Depth of box shadow.
 *
 * @event corner-click - Triggered when top right corner of the card is clicked
 *
 */
@customElement('fds-card')
export default class FdsCard extends LitElement {
  @property() elevation: FdsCardElevation = FdsCardElevation.low

  override render(): TemplateResult {
    this.style.boxShadow = this.getElevationStyle()

    return html`
      <slot name="header">
        <div class="card__header">
          <h4 class="card__header-title heading-small-4-text">
            <slot name="header-title"></slot>
          </h4>
          <div class="card__header-corner" @click=${this.onClick}>
            <slot name="header-corner"></slot>
          </div>
        </div>
      </slot>
      <div class="card__content">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    `
  }

  getElevationStyle(): string {
    if (this.elevation === FdsCardElevation.none) {
      return 'none'
    } else if (this.elevation === FdsCardElevation.high) {
      return FdsTokenStyleElevation200.value
    }
    return FdsTokenStyleElevation100.value
  }

  onClick(): void {
    this.dispatchEvent(new CustomEvent<void>('corner-click'))
  }

  static override styles = [
    headingSmall4TextClass,
    css`
      :host {
        display: block;
        background: white;
        width: 100%;
      }

      h4 {
        margin: 0;
      }

      .card__header {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        padding: ${FdsSize3} ${FdsSize4} ${FdsSize1};
      }

      .card__content {
        padding: ${FdsSize2} ${FdsSize4};
      }
    `,
  ]
}

import {
  FdsColorBrandBlack,
  FdsColorBrandWhite,
  FdsColorDanger300,
  FdsColorDanger400,
  FdsColorInteractive200,
  FdsColorNeutral100, FdsColorNeutral200,
  FdsColorText300,
  FdsRadiusLarge,
  FdsSize6, FdsSizeToken,
  uiLabelTextClass
} from "../../coreui-css/lib";
import { css, CSSResult, html, LitElement } from 'lit'
import { TemplateResult } from 'lit-html'
import { customElement, property } from 'lit/decorators.js'
import { FdsIconType } from './fds-icon'
import './global-types'

export enum FdsButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  danger = 'danger',
  clear = 'clear'
}

const variantColorMap: Record<FdsButtonVariant, CSSResult> = {
  primary: FdsColorBrandWhite,
  secondary: FdsColorBrandBlack,
  tertiary: FdsColorBrandBlack,
  danger: FdsColorBrandWhite,
  clear: FdsColorNeutral200,
}

/**
 * Button component.
 *
 * @event click - Dispatches a MouseEvent on click.
 *
 * @property {FdsButtonVariant} variant - Button style.
 * @property {boolean} disabled - Disable button.
 * @property {FdsIconType} icon - Optional icon.
 * @property {string} label - Text to show.
 *
 */
@customElement('fds-button')
export default class FdsButton extends LitElement {
  @property() variant: FdsButtonVariant = FdsButtonVariant.primary
  @property() disabled: boolean = false
  @property() icon?: FdsIconType
  @property() label?: string
  @property() iconSize?: FdsSizeToken

  override render(): TemplateResult {
    return html`
      <button class="button--${this.variant}" ?disabled="${this.disabled}">
        ${this.icon && html`<fds-icon .size=${this.iconSize} .icon="${this.icon}"></fds-icon>`}
        ${this.label && html`<span class="ui-label-text">${this.label}</span>`}
      </button>
    `
  }

  static override styles = [
    uiLabelTextClass,
    css`
      :host {
        display: inline-flex;
        justify-content: center;
      }

      button {
        cursor: pointer;
        display: flex;
        border: 2px solid ${FdsColorBrandBlack};
        border-radius: ${FdsRadiusLarge};
        padding: 13px 16px;
        height: ${FdsSize6};
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 200ms;
        width: inherit;
      }

      button *,
      button ::slotted(*) {
        line-height: 1;
      }

      .button--primary {
        border-color: ${FdsColorBrandBlack};
        background: ${FdsColorBrandBlack};
        color: ${variantColorMap[FdsButtonVariant.primary]};
      }

      .button--secondary {
        border: 2px solid ${FdsColorBrandBlack};
        background: ${FdsColorBrandWhite};
        color: ${variantColorMap[FdsButtonVariant.secondary]};
      }

      .button--tertiary {
        background: transparent;
        border-color: transparent;
        color: ${variantColorMap[FdsButtonVariant.tertiary]};
      }

      .button--danger {
        background: ${FdsColorDanger300};
        border-color: transparent;
        color: ${variantColorMap[FdsButtonVariant.danger]};
      }

      .button--clear {
        position: absolute;
        right: 6px;
        top: 10.5px;
        bottom: 0;

        background: transparent;
        border-color: transparent;
        color: ${variantColorMap[FdsButtonVariant.clear]};
        padding: 0;
        border-radius: 50%;
        height: 24px;
        align-self: center;
      }

      .button--primary:hover,
      .button--secondary:hover,
      .button--tertiary:hover {
        background: ${FdsColorInteractive200};
        border-color: transparent;
        color: ${FdsColorBrandWhite};
      }

      .button--clear:hover {
        color: ${FdsColorBrandBlack};
      }

      .button--danger:hover {
        background: ${FdsColorDanger400};
        border-color: ${FdsColorDanger400};
        color: ${FdsColorBrandWhite};
      }

      .button--primary:disabled {
        background: ${FdsColorNeutral100};
        border-color: ${FdsColorNeutral100};
        color: ${FdsColorText300};
      }

      .button--secondary:disabled {
        background: transparent;
        color: ${FdsColorNeutral100};
        border-color: ${FdsColorNeutral100};
      }

      .button--tertiary:disabled {
        background: transparent;
        border-color: transparent;
        color: ${FdsColorNeutral100};
      }

      .button--danger:disabled {
        background: ${FdsColorNeutral100};
        border-color: transparent;
        color: ${FdsColorText300};
      }
    `,
  ]
}

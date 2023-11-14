import {
  FdsColorBrandBlack,
  FdsColorInteractive200,
  FdsColorText300,
  FdsRadiusCompact,
  uiLabelTextClass
} from '../../coreui-css/lib'
import { css, html, LitElement } from 'lit'
import { TemplateResult } from 'lit-html'
import { customElement, property } from 'lit/decorators.js'
import './global-types'
import { FdsInputChange } from "./fds-input";

/**
 * Checkbox component.
 *
 * @property {string} label - Label for the checkbox.
 * @property {boolean} disabled - Disable checkbox.
 * @property {boolean} checked - Checkbox value.
 * @event select - Dispatches a custom event when checkbox is clicked. The value is in the event details field.
 */
@customElement('fds-checkbox')
export default class FdsCheckbox extends LitElement {
  @property() label: string = ''
  @property() name: string = ''
  @property() disabled: boolean = false
  @property() checked: boolean = false

  override render(): TemplateResult {
    return html`
      <input
        type="checkbox"
        id="checkbox"
        name=${this.name}
        .disabled=${this.disabled}
        .checked="${this.checked}"
        @change=${this.handleSelect}
      />
      ${this.label && html`<label for="checkbox" class="ui-label-text">${this.label}</label>`}
    `
  }

  private handleSelect(): void {
    if (!this.disabled) {
      this.checked = !this.checked
      const change: FdsInputChange = {
        name: this.name,
        value: this.checked
      }
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent<FdsInputChange>('check', { detail: change, bubbles: true }))
      })
    }
  }

  static override styles = [
    uiLabelTextClass,
    css`
      :host {
        user-select: none;
      }

      #checkbox {
        appearance: none;
      }

      label {
        padding: 0 16px;
        position: relative;
        right: 7px;
        margin-bottom: 16px;
      }

      label,
      #checkbox::before {
        cursor: pointer;
      }

      #checkbox::before {
        content: '';
        height: 16px;
        width: 16px;
        display: inline-block;
        vertical-align: sub;
        border: 2px solid ${FdsColorBrandBlack};
        border-radius: ${FdsRadiusCompact};
      }

      #checkbox:checked::before {
        border-color: ${FdsColorInteractive200};
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEwIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zLjM4Nzc2IDcuNDAzM0wwLjE0NjA2NiA0LjE2MTYxQy0wLjA0ODY4ODcgMy45NjY4NSAtMC4wNDg2ODg3IDMuNjUxMDggMC4xNDYwNjYgMy40NTYzMUwwLjg1MTM0OSAyLjc1MUMxLjA0NjEgMi41NTYyMyAxLjM2MTkgMi41NTYyMyAxLjU1NjY1IDIuNzUxTDMuNzQwNDEgNC45MzQ3NEw4LjQxNzc4IDAuMjU3Mzk0QzguNjEyNTQgMC4wNjI2Mzk0IDguOTI4MzMgMC4wNjI2Mzk0IDkuMTIzMDggMC4yNTczOTRMOS44MjgzNyAwLjk2MjY5NkMxMC4wMjMxIDEuMTU3NDUgMTAuMDIzMSAxLjQ3MzIyIDkuODI4MzcgMS42NjhMNC4wOTMwNiA3LjQwMzMyQzMuODk4MjkgNy41OTgwOCAzLjU4MjUxIDcuNTk4MDggMy4zODc3NiA3LjQwMzNWNy40MDMzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==');
        background-color: ${FdsColorInteractive200};
        background-repeat: no-repeat;
        background-position: center;
      }

      #checkbox:disabled::before,
      #checkbox:disabled + label {
        cursor: default;
        color: ${FdsColorText300};
      }

      #checkbox:disabled::before {
        border-color: ${FdsColorText300};
      }

      #checkbox:disabled#checkbox:checked::before {
        background-color: ${FdsColorText300};
      }
    `,
  ]
}

import { css, html, LitElement, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import {
  uiHelperTextClass,
  uiLabelTextClass,
  FdsColorBrandWhite,
  FdsColorDanger200,
  FdsColorNeutral200,
  FdsColorNeutral50,
  FdsColorText1000,
  FdsColorText300,
  FdsColorText600,
  FdsTokenSize21
} from '../../coreui-css/lib'
import { FdsButtonVariant } from "./fds-button";

export interface FdsInputChange {
  name: string
  value: string | boolean | number
}

/**
 * Input component.
 *
 * @property {string} label - Label for the input.
 * @property {string} name - Name for the input.
 * @property {string} value - Set value for the input.
 * @property {string} placeholder - Placeholder for the input when there is no value.
 * @property {string} message - Helper/error message. Additional information or instructions about the purpose of the input field or the expected user input.
 * @property {boolean} error - Display error state.
 * @property {boolean} disabled - Disable input.
 *
 * @event change Dispatches a custom event when input value is changed. The value is in the event details field.
 *
 */
@customElement('fds-input')
export default class FdsInput extends LitElement {
  @property() value: string = ''
  @property() name: string = ''
  @property() label?: string
  @property() placeholder?: string
  @property() message?: string
  @property() error: boolean = false
  @property() disabled: boolean = false
  @property() type?: string = 'text'
  @property() clearable?: boolean = false

  override render(): TemplateResult {
    return html`
      ${this.label && html`<label for="input" class="input-label ui-label-text">${this.label}</label>`}
      <div class="input-container ui-label-text">
        <input
          name=${this.name}
          type=${this.type}
          aria-label=${this.name}
          onFocus=${() => { this.error = false }}
          placeholder=${ifDefined(this.placeholder)}
          class="ui-label-text ${this.error ? 'input--error' : ''}"
          .value=${this.value}
          ?disabled=${this.disabled}
          @input=${this.handleChange}
        />
        ${this.clearable && this.value
          ? html`<fds-button
              .iconSize=${FdsTokenSize21}
              icon="x"
              @click=${() => this.handleClear()}
              variant=${FdsButtonVariant.clear}
            />`
          : ''}
      </div>
      ${this.message &&
      html`<span class="input-message ui-helper-text ${this.error ? 'input-message--error' : ''}"
        >${this.message}</span>`}
    `
  }

  private handleChange(event: Event): void {
    const input = event.target as FdsInput
    const detail: FdsInputChange = {
      name: input.name,
      value: input.value
    }
    this.value = input.value
    this.dispatchEvent(
      new CustomEvent<FdsInputChange>('change', {
        detail,
        bubbles: true,
        cancelable: true,
        composed: false, // Allows event to bubble through shadow dom - false for now, but could be re-evaluated later.
      })
    )
  }

  private handleClear() {
    const inputElement = this.shadowRoot?.querySelector('input[name="' + this.name + '"]') as HTMLInputElement
    inputElement.value = ''
    this.value = ''
    const detail: FdsInputChange = {
      name: this.name,
      value: ''
    }
    this.dispatchEvent(
      new CustomEvent<FdsInputChange>('change', {
        detail,
        bubbles: true,
        cancelable: true,
        composed: false, // Allows event to bubble through shadow dom - false for now, but could be re-evaluated later.
      })
    )
  }

  static override styles = [
    uiLabelTextClass,
    uiHelperTextClass,
    css`
      :host {
        display: flex;
        flex-direction: column;
      }

      .input-label {
        padding-bottom: 8px;
        color: ${FdsColorText1000};
      }

      .input-container {
        display: inline-flex;
        position: relative;
      }

      input {
        width: 100%;
        height: 46px;
        text-overflow: ellipsis;
        padding: 0px 16px;
        padding-right: 30px;
        background-color: ${FdsColorBrandWhite};
        border: 1px solid ${FdsColorNeutral200};
        border-radius: 4px;
        color: ${FdsColorText1000};
        box-sizing: border-box;
      }

      ::placeholder {
        color: ${FdsColorText300};
        font-weight: 400 !important;
      }

      input:disabled {
        border-color: ${FdsColorNeutral200};
        color: ${FdsColorText300};
        background-color: ${FdsColorNeutral50};
      }

      .input--error {
        border: 3px solid ${FdsColorDanger200};
        color: ${FdsColorDanger200};
      }

      .input-message {
        padding-top: 8px;
        color: ${FdsColorText600};
      }

      .input-message--error {
        color: ${FdsColorDanger200};
      }

      input:focus {
        border: 3px solid transparent;
      }
    `,
  ]
}

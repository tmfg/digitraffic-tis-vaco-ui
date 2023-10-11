import {
  FdsColorBrandWhite,
  FdsColorDanger200,
  FdsColorInteractive100,
  FdsColorInteractive300,
  FdsColorNeutral200,
  FdsColorNeutral50,
  FdsColorText1000,
  FdsColorText300,
  FdsStyleElevation200
} from '../../coreui-css/lib'
import { css, html, LitElement } from 'lit'
import { TemplateResult } from 'lit-html'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { uiLabelTextClass } from '../../coreui-css/lib'
import './global-types'

export class FdsComboboxEvent extends CustomEvent<string> {
  constructor(detail: string) {
    // composed allows event to bubble through shadow dom - false for now, but could be re-evaluated later.
    super('select', { detail, bubbles: true, cancelable: true, composed: false })
  }
}

/**
 * Combobox component.
 *
 * @event select - Dispatches an custom event when element loses focus. Focus is lost on following scenarios:
 * 1. User clicks outside the element
 * 2. User presses Enter
 * 3. User clicks an option from the menu
 *
 * @property {string} value - Set value for the component.
 * @property {string} options - List of options to suggest to user.
 * @property {boolean} disabled - Disable combobox.
 * @property {boolean} error - Display error indicator on combobox.
 * @property {string} placeholder - Placeholder value to show while combobox has no input.
 * @property {boolean} addNewIndicator - Show a text indicator at options list telling user he can add the current value.
 */
@customElement('fds-combobox')
export default class FdsCombobox extends LitElement {
  constructor() {
    super()
    // Set attributes to host element
    this.addEventListener('blur', () => {
      this._open = false
      this.dispatchEvent(new FdsComboboxEvent(this.value))
    })
  }

  @property() value: string = ''
  @property() options: string[] = []
  @property() disabled: boolean = false
  @property() error: boolean = false
  @property() placeholder?: string
  @property() addNewIndicator: boolean = false

  @state() private _open: boolean = false

  override render(): TemplateResult {
    const filteredOptions = this.options.filter((option: string) =>
      // TypeScript optional checking is used incase the component is called with an explicitly undefined 'value' property
      option.toLowerCase().includes(this.value?.toLowerCase())
    )

    const addOptionRow = html`
      <div
        @click=${(): void => this.handleSelectFromList(this.value)}
        @keypress=${(e: KeyboardEvent): void => this.handleOptionKeypress(e, this.value)}
        @mouseenter=${(e: MouseEvent): void => this.addSelectedTo(e.target as Element)}
        @mouseleave=${this.removeSelected}
        class="option new ui-label-text"
        tabindex=${0}
      >
        <fds-icon .icon=${'plus'}></fds-icon>Lisää "${this.value}"
      </div>
    `

    const optionsList = html`
      <div id="options-list">
        ${filteredOptions.map(
          option => html`
            <div
              @click=${(): void => this.handleSelectFromList(option)}
              @keypress=${(e: KeyboardEvent): void => this.handleOptionKeypress(e, option)}
              @mouseenter=${(e: MouseEvent): void => this.addSelectedTo(e.target as Element)}
              @mouseleave=${this.removeSelected}
              class="option ui-label-text"
              tabindex=${0}
              aria-selected=${this.value === option}
            >
              ${option}
            </div>
          `
        )}
        ${this.addNewIndicator && this.value ? addOptionRow : null}
      </div>
    `

    return html`
      <div @click=${(): boolean => (this._open = true)} class=${`input-container ${this.getInputCssClass()}`}>
        <input
          type="text"
          class="ui-label-text"
          .value=${this.value}
          @input=${this.handleInput}
          @keydown=${this.handleInputKeydown}
          placeholder=${ifDefined(this.placeholder)}
          aria-haspopup=${true}
          aria-expanded=${this._open}
        />
        <fds-icon .icon=${this._open ? 'chevron-up' : 'chevron-down'}></fds-icon>
      </div>
      ${this._open ? optionsList : null}
    `
  }

  private handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement
    this.value = target.value
  }

  /**
   * This method is used merely for tab selection, which is an accessability option.
   * When selecting options via arrow keys, the selection is handled differently.
   */
  private handleOptionKeypress(e: KeyboardEvent, selectedOption: string): void {
    if (e.key === 'Enter') {
      this.handleSelectFromList(selectedOption)
    }
  }

  private handleSelectFromList(newValue: string): void {
    this.value = newValue
    this.blur()
  }

  private handleInputKeydown(e: KeyboardEvent): void {
    const { shadowRoot } = this
    if (!shadowRoot) {
      return
    }

    this._open = true

    const selected = shadowRoot.querySelector('.selected')

    if (e.key === 'Escape') {
      this._open = false
      const target = e.target as HTMLInputElement
      target.select()
    }

    if (e.key === 'Enter') {
      if (selected && !selected.classList.contains('new') && selected.textContent) {
        this.value = selected.textContent.trim()
      }
      this.blur()
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()

      if (selected) {
        this.addSelectedTo(selected.previousElementSibling)
      } else {
        this.addSelectedTo(shadowRoot.querySelector('.option:last-child'))
      }
      this.scrollToView()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()

      if (selected) {
        this.addSelectedTo(selected.nextElementSibling)
      } else {
        this.addSelectedTo(shadowRoot.querySelector('.option:first-child'))
      }
      this.scrollToView()
    } else {
      this.removeSelected()
    }
  }

  private scrollToView(): void {
    this.shadowRoot?.querySelector('.selected')?.scrollIntoView({
      behavior: 'auto',
      inline: 'nearest',
      block: 'nearest',
    })
  }

  private removeSelected(): void {
    if (this.shadowRoot) {
      this.shadowRoot.querySelectorAll('.selected').forEach(node => node.classList.remove('selected'))
    }
  }

  private addSelectedTo(node: Element | null): void {
    this.removeSelected()
    if (node) {
      node.classList.add('selected')
    }
  }

  private getInputCssClass(): string {
    if (this.disabled) {
      return 'disabled'
    }
    if (this.error) {
      return 'error'
    }
    if (!this.value && this.placeholder) {
      return 'placeholder'
    }
    return ''
  }

  static override styles = [
    uiLabelTextClass,
    css`
      :host {
        width: 100%;
        position: relative;
      }

      .input-container {
        cursor: pointer;
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;

        width: 100%;
        /* TODO: what values? */
        height: 46px; // element should be total of 48px (same as dropdown), children has 1px border
      }

      .input-container > input {
        width: inherit;
        height: inherit;
        text-overflow: ellipsis;
        padding-top: 0px;
        padding-bottom: 0px;
        padding-left: 16px;
        padding-right: 40px; // icon 24px + 8px padding for left and right
        background-color: ${FdsColorBrandWhite};
        border: 1px solid ${FdsColorNeutral200};
      }

      .input-container > fds-icon {
        pointer-events: none;
        position: absolute;
        right: 8px;
        color: ${FdsColorText1000};
      }

      .input-container.disabled {
        pointer-events: none;
      }

      .input-container.disabled > input {
        cursor: default;
        background-color: ${FdsColorNeutral50};
        color: ${FdsColorText300};
      }

      .input-container.error > input {
        color: ${FdsColorDanger200};
        border: 3px solid ${FdsColorDanger200};
      }

      input::placeholder {
        color: ${FdsColorText300};
      }

      #options-list {
        cursor: pointer;
        display: block;
        position: absolute;
        overflow-y: scroll;

        min-width: 100%;
        max-width: fit-content;
        /* TODO: what value? */
        max-height: 80vw;

        box-shadow: ${FdsStyleElevation200};
      }

      .option {
        display: flex;
        align-items: center;
        white-space: nowrap;

        /* TODO: what values? */
        height: 56px;
        padding-left: 16px;
        padding-right: 8px;

        background-color: ${FdsColorBrandWhite};
        border-bottom: 1px solid ${FdsColorNeutral200};
      }

      .option.selected {
        /* TODO: what color? */
        background-color: ${FdsColorInteractive100};
      }

      .option.new {
        color: ${FdsColorInteractive300};
        gap: 10px;
      }
    `,
  ]
}

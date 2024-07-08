import { Page } from '@playwright/test'

//This only works locally when running with debug because of the 2FA
export class Login {
  constructor(private page: Page) {}
  async login() {
    const loginElement = this.page.locator('li.item__first-right > div.item__label > span')
    const value = await loginElement.textContent()
    await this.page.locator(`span >> text=${value}`).click()

    const userNameTextBox = this.page.locator('[name=loginfmt]')
    await userNameTextBox.fill(process.env.user!)
    await this.page.getByRole('button', { name: 'Next' }).click()

    const passwordTextBox = this.page.locator('[name=passwd]')
    await passwordTextBox.fill(process.env.password!)
    await this.page.getByRole('button', { name: 'Sign In' }).click()

    console.log('Waiting to be approved in auth app')

    const userElement = this.page.locator('li.item__first-right > div.item__label > span').first()
    const userValue = await userElement.textContent()
    console.log('Element value:', userValue)
    //await page.waitForTimeout(30000)
    const successLocator = this.page.locator(`span >> text=${userValue}`)

    try {
      await successLocator.waitFor({ timeout: 30000 })
      console.log('2FA approved and login successful')
      /*storageState usage will be done when we get test user, so there is no need to log in separately on every test
      await this.page.context().storageState({ path: 'storageState.json' })*/
    } catch (e) {
      console.log('2FA approval failed or timed out')
      throw new Error('2FA approval failed or timed out')
    }
  }
}

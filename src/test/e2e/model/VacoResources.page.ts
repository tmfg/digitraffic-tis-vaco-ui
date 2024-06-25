import { Page } from '@playwright/test'

export class VacoResourcesPage {
  constructor(private page: Page) {}
  async navigate() {
    await this.page.goto('/ui')
  }
}

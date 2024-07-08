import { Environment } from '../../../types/Bootstrap.ts'
import { Page } from '@playwright/test'

//this is temporary, API testing needs to be done differently, maybe using containers
export class APIMockingPage {
  constructor(private page: Page) {}

  async APIMocking() {
    await this.page.route('http://localhost:8080/api/ui/bootstrap', async (route) => {
      const json = {
        environment: Environment.Local,
        baseUrl: 'http://localhost:8080',
        tenantId: 'd8536c71-f91f-4e54-b68c-215a7fd9510b',
        clientId: '57c1b8a0-f33e-4e47-840d-8c180d933c41'
      }
      await route.fulfill({ json })
    })
  }
}

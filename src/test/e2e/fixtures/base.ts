import { test as baseTest } from '@playwright/test'
import { i18nFixture } from './i18nFixture'
import process from 'node:process'
import fs from 'fs'
import path from 'path'

const istanbulCLIOutput = path.join(process.cwd(), '../coverage')

export const test = baseTest.extend(i18nFixture).extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener('beforeunload', () =>
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))
      )
    )
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true })
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON) {
        fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage.json`), coverageJSON)
      }
    })
    await use(context)
    for (const page of context.pages()) {
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)))
    }
  }
})
export const expect = test.expect

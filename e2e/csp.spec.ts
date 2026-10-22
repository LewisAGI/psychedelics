import { expect, test } from '@playwright/test';
import { startHeadersServer } from './serve-headers';

test('origins loads under the published CSP with no policy errors', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one browser is enough for the policy');
  const server = await startHeadersServer();
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    const text = message.text();
    if (/content security policy/i.test(text)) consoleErrors.push(text);
  });
  await page.addInitScript(() => {
    const record = window as Window & { __cspViolations?: string[] };
    record.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      record.__cspViolations?.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  const tile = page.waitForResponse(
    (response) => response.url().includes('gibs.earthdata.nasa.gov') && response.ok(),
    { timeout: 20_000 },
  );
  try {
    await page.goto(`http://127.0.0.1:${server.port}/origins`);
    await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true');
    await tile;
    const violations = await page.evaluate(
      () => (window as Window & { __cspViolations?: string[] }).__cspViolations ?? [],
    );
    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(violations, violations.join('\n')).toEqual([]);
  } finally {
    await server.close();
  }
});

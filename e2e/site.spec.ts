import { expect, test } from '@playwright/test';

test('lists the pack, the notice, and icon controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByText(/Not medical advice/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Psilocybin/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Salvia divinorum/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Psychedelics' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Harm reduction' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Timeline' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Reading' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Origins' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Glossary' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Interactions' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Compare' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Methoxetamine/ })).toContainText('Incomplete');
  await expect(page.locator('.pill')).toHaveCount(0);
});

test('search and filter stay in pop-outs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('ibogaine');
  await expect(page.locator('.catalog').getByRole('link', { name: /Ibogaine/ })).toBeVisible();
  await expect(page.locator('#search-popout').getByRole('link', { name: /Ibogaine/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Psilocybin/ })).toHaveCount(0);
  await page.getByRole('textbox', { name: 'Search' }).fill('');
  await page.getByRole('button', { name: 'Filter' }).click();
  const popout = page.locator('#filter-popout');
  await expect(popout).toBeVisible();
  await popout.getByRole('button', { name: 'Entactogen' }).click();
  await expect(page.getByRole('link', { name: /MDMA/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Ibogaine/ })).toHaveCount(0);
  await expect(page.locator('.pill')).toHaveCount(0);
});

test('a substance page shows history, status, the spectrum, and a citation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Psilocybin/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Psilocybin/ })).toBeVisible();
  await expect(page.getByText(/Mazatec mushroom ceremonies/)).toBeVisible();
  await expect(page.getByText('Psilocybin is Schedule I', { exact: false })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Effects spectrum' })).toBeVisible();
  await expect(page.getByText('Evidence').first()).toBeVisible();
  await page.getByRole('button', { name: 'Sources' }).first().click();
  await expect(page.getByRole('link', { name: /Wasson/ })).toBeVisible();
  await expect(page.getByText('Unverified')).toHaveCount(0);
});

test('uncertain facts stay off the page', async ({ page }) => {
  await page.goto('/substance/mdma');
  await expect(page.getByText(/resubmitted the NDA/)).toHaveCount(0);
  await expect(page.getByText('Uncertain')).toHaveCount(0);
  await expect(page.getByText('Unverified')).toHaveCount(0);
  await expect(page.getByText('Evidence').first()).toBeVisible();
  await page.goto('/substance/dmt-ayahuasca');
  await expect(page.getByText('Inference').first()).toBeVisible();
});

test('EU status follows the EMA medicines list', async ({ page }) => {
  await page.goto('/substance/psilocybin');
  const note = page.locator('[data-status="eu"]');
  await expect(note.getByText('No EU central authorisation')).toBeVisible();
  await note.getByRole('button', { name: 'Sources' }).click();
  await expect(note.getByRole('link', { name: /EMA medicines output/ })).toBeVisible();
  await page.goto('/substance/ketamine');
  await expect(page.getByText(/EU-wide marketing authorisation/)).toBeVisible();
  await expect(page.getByText('No EU central authorisation')).toHaveCount(0);
  await expect(page.locator('[data-status="eu"]')).toHaveCount(0);
  await page.goto('/substance/methoxetamine');
  await expect(page.getByText('Incomplete').first()).toBeVisible();
  await expect(page.getByText('No EU central authorisation')).toBeVisible();
});

test('timeline and further reading come from the pack', async ({ page }) => {
  await page.goto('/timeline');
  const events = page.locator('.timeline > li');
  await expect(events).toHaveCount(21);
  await expect(events.first()).toContainText('1938/1943');
  await expect(events.last()).toContainText('2026-08-10');
  await events.first().getByRole('button', { name: 'Sources' }).click();
  await expect(page.getByRole('link', { name: /Hofmann/ })).toBeVisible();
  await page.goto('/reading');
  await expect(page.locator('.reading li')).toHaveCount(12);
  await expect(page.getByText('Standard safety framework for psychedelic sessions')).toBeVisible();
  await expect(page.getByRole('link', { name: /Johnson MW/ })).toBeVisible();
});

test('harm-reduction links open from a pop-out', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Harm reduction' }).click();
  const resources = page.locator('#resources-popout');
  await expect(resources.getByRole('link', { name: 'DanceSafe' })).toHaveAttribute('href', 'https://dancesafe.org/');
  await expect(resources.getByRole('link', { name: 'FRANK' })).toBeVisible();
  await expect(resources.getByRole('link', { name: 'Fireside Project' })).toBeVisible();
  await expect(resources.getByRole('link', { name: '988 Suicide & Crisis Lifeline' })).toBeVisible();
});

test('origins map marks places named in the history', async ({ page }) => {
  await page.goto('/origins');
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.pin')).toHaveCount(3);
  await page.getByRole('button', { name: /Salvia divinorum, Oaxaca/ }).click();
  await expect(page.getByText(/Mazatec of Oaxaca/)).toBeVisible();
});

test('glossary, compare, interactions, and the timeline filter use the pack', async ({ page }) => {
  await page.goto('/glossary');
  await expect(page.getByRole('heading', { level: 1, name: 'Glossary' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Psilocybin/ })).toBeVisible();
  await expect(page.getByText('Classic serotonergic psychedelic (5-HT2A agonist via psilocin)')).toBeVisible();
  await expect(page.locator('.pill')).toHaveCount(0);

  await page.goto('/compare');
  await page.getByRole('button', { name: 'First' }).click();
  await page.locator('#compare-a').getByRole('button', { name: /Ketamine/ }).click();
  await page.getByRole('button', { name: 'Second' }).click();
  await page.locator('#compare-b').getByRole('button', { name: /Psilocybin/ }).click();
  await expect(page.getByRole('heading', { level: 2, name: /Ketamine/ })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: /Psilocybin/ })).toBeVisible();
  await expect(page.getByText('No EU central authorisation')).toBeVisible();
  await expect(page.locator('[data-status="eu"]')).toHaveCount(1);
  await expect(page.locator('.pill')).toHaveCount(0);

  await page.goto('/interactions');
  await expect(page.getByRole('heading', { level: 1, name: 'Interactions' })).toBeVisible();
  await expect(page.getByText(/serotonin syndrome/).first()).toBeVisible();
  await expect(page.getByText('Interaction data are limited')).toHaveCount(0);

  await page.goto('/timeline');
  await page.getByRole('button', { name: 'Substance' }).click();
  await page.locator('#timeline-filter').getByRole('button', { name: /Psilocybin/ }).click();
  await expect(page.getByText(/tobacco-cessation/)).toBeVisible();
  await expect(page.getByText(/Hofmann synthesises/)).toHaveCount(0);
  await page.getByRole('link', { name: 'Psilocybin', exact: true }).first().click();
  await expect(page).toHaveURL(/\/substance\/psilocybin/);
});

test('search reaches a timeline row and a fact cross-links', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Hofmann');
  await expect(page.locator('#search-popout').getByRole('link', { name: /Hofmann synthesises/ })).toBeVisible();
  await page.goto('/substance/psilocybin');
  await page.getByRole('link', { name: 'MDMA', exact: true }).first().click();
  await expect(page).toHaveURL(/\/substance\/mdma/);
});

test('a long press reveals the control label', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'iphone', 'touch label');
  await page.goto('/');
  const search = page.getByRole('button', { name: 'Search' });
  await search.dispatchEvent('pointerdown', { pointerType: 'touch' });
  await expect(search).toHaveClass(/is-long-tip/);
});

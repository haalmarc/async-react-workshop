import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.patch('/api/simulator', { data: { delayMs: 0, failNextSave: false } });
  await request.post('/api/reset');
});

for (const variant of ['base', 'tasks', 'solution']) {
  test(`${variant}: dagbytte, favorittsuksess og rollback ved feil`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${variant}`);
    await expect(page.getByRole('link', { name: /Det som skjer mens vi venter/ })).toBeVisible();
    await page.getByRole('button', { name: 'Dag 2', exact: true }).click();
    await expect(page.getByRole('link', { name: /En grense for venting/ })).toBeVisible();
    await page.getByRole('link', { name: /En grense for venting/ }).click();
    await expect(page.getByRole('heading', { name: 'En grense for venting' })).toBeVisible();
    const favorite = page.getByRole('button', { name: /Legg til favoritt|♥ Favoritt/ });
    await expect(favorite).toHaveAttribute('aria-pressed', 'false');
    await request.patch('/api/simulator', { data: { delayMs: 1000 } });
    await favorite.click();
    await expect(favorite).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Lagrer …', { exact: true })).toBeVisible();
    await expect(favorite).toBeEnabled();
    await page.getByRole('button', { name: 'La neste lagring feile' }).click();
    await expect(page.getByRole('button', { name: /Neste lagring vil feile/ })).toBeVisible();
    await favorite.click();
    await expect(favorite).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('alert')).toContainText('Simulert feil');
    await expect(favorite).toHaveAttribute('aria-pressed', 'true');
    expect(errors).toEqual([]);
  });
}

test('solution: pending omfatter datahenting, og lokal React ViewTransition virker', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const original = document.startViewTransition.bind(document);
    (window as unknown as { animationCount: number }).animationCount = 0;
    document.startViewTransition = (...args) => {
      (window as unknown as { animationCount: number }).animationCount++;
      return original(...args);
    };
  });
  await page.goto('/solution');
  const first = page.getByRole('link', { name: /Det som skjer mens vi venter/ });
  await expect(first).toBeVisible();
  await request.patch('/api/simulator', { data: { delayMs: 1000 } });
  await page.getByRole('button', { name: 'Dag 2', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Dag 2', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText('Henter program …')).toBeVisible();
  await expect(first).toBeVisible();
  await expect(page.getByRole('link', { name: /En grense for venting/ })).toBeVisible();
  await page.getByRole('button', { name: 'Vis praktisk info' }).click();
  await expect(page.getByText(/Begge dagene starter/)).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { animationCount: number }).animationCount),
    )
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Skjul praktisk info' }).click();
  await expect(page.getByText(/Begge dagene starter/)).toBeHidden();
  const beforeNavigation = await page.evaluate(
    () => (window as unknown as { animationCount: number }).animationCount,
  );
  await page.getByRole('link', { name: /En grense for venting/ }).click();
  await expect(page.getByRole('heading', { name: 'En grense for venting' })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { animationCount: number }).animationCount),
    )
    .toBeGreaterThan(beforeNavigation);
  expect(errors).toEqual([]);
});

test('Suspense-feilgrensen kan prøve datahenting på nytt', async ({ page }) => {
  let fail = true;
  await page.route('**/api/sessions/cache', async (route) => {
    if (fail) {
      fail = false;
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Lesingen feilet én gang' }),
      });
    } else await route.continue();
  });
  await page.goto('/solution/sessions/cache');
  await expect(page.getByRole('alert')).toContainText('Lesingen feilet én gang');
  await page.getByRole('button', { name: 'Prøv igjen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cache er også et produktvalg' })).toBeVisible();
});

test('cache-panelet gir ny lasting, og API-data deles mellom variantene', async ({ page }) => {
  await page.goto('/solution/sessions/cache');
  const favorite = page.getByRole('button', { name: /Legg til favoritt|♥ Favoritt/ });
  await favorite.click();
  await expect(favorite).toBeEnabled();
  await page.getByRole('link', { name: 'Referanse', exact: true }).click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('API-forsinkelse').selectOption('1000');
  await page.getByRole('button', { name: 'Tøm cache' }).click();
  await expect(page.getByText('Henter sesjonsdetaljer …')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cache er også et produktvalg' })).toBeVisible();
});

test('useActionState: servervalidering, bevart tekst ved feil og suksess', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/solution/questions');
  const field = page.getByLabel('Spørsmålet ditt');
  await field.fill('Hei');
  await page.getByRole('button', { name: 'Send spørsmål', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('minst fem tegn');
  await expect(field).toHaveValue('Hei');
  await field.fill('Hvordan fungerer dette?');
  await page.getByRole('button', { name: 'La neste lagring feile' }).click();
  await page.getByRole('button', { name: 'Send spørsmål', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Simulert feil');
  await expect(field).toHaveValue('Hvordan fungerer dette?');
  await page.getByRole('button', { name: 'Send spørsmål', exact: true }).click();
  await expect(page.getByRole('listitem')).toHaveText('Hvordan fungerer dette?');
  await expect(field).toHaveValue('');
  expect(errors).toEqual([]);
});

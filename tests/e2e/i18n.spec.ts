import { expect, test, type Page } from '@playwright/test';

const LOCALES = ['de', 'en', 'fr', 'ar'] as const;
const DIR: Record<(typeof LOCALES)[number], 'ltr' | 'rtl'> = {
  de: 'ltr',
  en: 'ltr',
  fr: 'ltr',
  ar: 'rtl',
};
const WIDTHS = [375, 768, 1280] as const;
const ROUTES = ['', '/projects', '/projects/stockwell', '/about', '/experience', '/contact'] as const;

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
}

test.describe('default language', () => {
  test('the root redirects to German, whatever the browser asks for', async ({ browser }) => {
    for (const acceptLanguage of ['ar', 'en-US,en;q=0.9', 'fr-FR']) {
      const context = await browser.newContext({ locale: acceptLanguage.split(',')[0]! });
      const page = await context.newPage();
      await page.setExtraHTTPHeaders({ 'Accept-Language': acceptLanguage });
      await page.goto('/');
      await expect(page).toHaveURL(/\/de$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await context.close();
    }
  });

  for (const locale of LOCALES) {
    test(`${locale}: sets lang and dir`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', DIR[locale]);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(5); // 4 + x-default
    });
  }

  test('an unknown page under a language shows the localised 404', async ({ page }) => {
    const response = await page.goto('/fr/nope');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cette page n’existe pas');
  });
});

test.describe('language switcher', () => {
  test('keeps route, query and hash, flips to RTL, and is remembered', async ({ page }) => {
    await page.goto('/de/projects?tech=TypeScript');
    await page.getByRole('button', { name: /Sprache/ }).click();
    await page.getByRole('menuitemradio', { name: 'العربية' }).click();

    await expect(page).toHaveURL(/\/ar\/projects\?tech=TypeScript$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('دراسات حالة هندسية');

    // Returning to the bare domain now lands on the language the visitor chose.
    await page.goto('/');
    await expect(page).toHaveURL(/\/ar$/);
  });

  test('works from the keyboard', async ({ page }) => {
    await page.goto('/en');
    const trigger = page.getByRole('button', { name: /Language/ });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('is available in the mobile drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Français' }).click();
    await expect(page).toHaveURL(/\/fr$/);
  });
});

test.describe('layout holds in every language', () => {
  for (const locale of LOCALES) {
    for (const width of WIDTHS) {
      test(`${locale} @ ${width}px has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        for (const route of ROUTES) {
          await page.goto(`/${locale}${route}`);
          await page.waitForLoadState('load');
          expect(await hasHorizontalOverflow(page), `${locale}${route}`).toBe(false);
        }
      });
    }
  }
});

test.describe('contact form', () => {
  const REQUIRED_NAME: Record<(typeof LOCALES)[number], string> = {
    de: 'Bitte geben Sie Ihren Namen an',
    en: 'Name is required',
    fr: 'Le nom est obligatoire',
    ar: 'الاسم مطلوب',
  };

  for (const locale of LOCALES) {
    test(`${locale}: validation messages are translated`, async ({ page }) => {
      await page.goto(`/${locale}/contact`);
      await page.locator('form button[type="submit"]').click();
      await expect(page.getByText(REQUIRED_NAME[locale])).toBeVisible();
    });
  }
});

test.describe('reduced motion', () => {
  for (const locale of LOCALES) {
    test(`${locale}: content is visible without animation`, async ({ page }) => {
      // The `reducedMotion` context option is unreliable against the headless
      // shell Chromium build this environment installed; `emulateMedia` talks to
      // CDP directly and is honoured consistently.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      // Server HTML and the reduced-motion client render must agree: a mismatch
      // surfaces as a console error ("Hydration failed…").
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      await page.goto(`/${locale}`);
      // Reveal wrappers must not leave content invisible.
      const contactHeading = page.locator('#contact h2');
      await contactHeading.scrollIntoViewIfNeeded();
      await expect(contactHeading).toBeVisible();
      expect(await page.locator('#hero h1').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
      // Stat figures are final numbers straight away.
      await expect(page.locator('#hero dl').last()).toContainText('12');
      // The scroll progress bar is hidden (present in the DOM, CSS `motion-reduce:hidden`).
      await expect(page.getByTestId('scroll-progress')).toBeHidden();
      expect(errors).toEqual([]);
    });
  }
});

test('no console errors on the home page in any language', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  for (const locale of LOCALES) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
  }
  expect(errors).toEqual([]);
});

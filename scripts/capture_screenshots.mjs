import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium, devices } from 'playwright';

const BASE = process.env.SCREENSHOT_BASE_URL || 'https://app.grandchefapp.online';
const OUT_DIR = path.join(process.cwd(), 'screenshots');

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'pricing', path: '/pricing' },
  { name: 'login', path: '/login' },
  { name: 'courses', path: '/courses' },
  { name: 'recipes', path: '/recipes' },
  { name: 'encyclopedia', path: '/encyclopedia' },
  { name: 'laboratory', path: '/laboratory' },
  { name: 'admin', path: '/admin' },
];

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function waitForAppSettled(page) {
  await page.waitForLoadState('domcontentloaded');
  // Give client hydration/animations a short moment.
  await page.waitForTimeout(600);
}

async function setLightTheme(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } catch {
      // ignore
    }
  });
}

async function captureVariant(browser, variant) {
  const context = await browser.newContext(variant.contextOptions);
  const page = await context.newPage();
  await setLightTheme(page);

  for (const p of PAGES) {
    const url = `${BASE}${p.path}`;
    console.log(`[${variant.name}] ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await waitForAppSettled(page);

    // For some pages we want a "content opened" screenshot too.
    if (p.name === 'recipes') {
      const firstCard = page.locator('.recipe-card').first();
      if (await firstCard.count()) {
        await firstCard.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);
      }
    }
    if (p.name === 'courses') {
      // Click first course card if unlocked; if locked, it will show login/pricing overlay.
      const firstCard = page.locator('.course-card').first();
      if (await firstCard.count()) {
        await firstCard.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(600);
      }
    }
    if (p.name === 'encyclopedia') {
      const firstCard = page.locator('.card.clickable').first();
      if (await firstCard.count()) {
        await firstCard.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);
      }
    }

    const filename = `${variant.name}__${p.name}.png`;
    await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: true });
  }

  await context.close();
}

async function main() {
  await ensureDir(OUT_DIR);
  const browser = await chromium.launch();

  const variants = [
    {
      name: 'desktop',
      contextOptions: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    },
    {
      name: 'mobile',
      contextOptions: { ...devices['iPhone 14'] },
    },
  ];

  try {
    for (const v of variants) {
      await captureVariant(browser, v);
    }
  } finally {
    await browser.close();
  }

  console.log(`OK: screenshots en ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


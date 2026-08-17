/**
 * Browser E2E — exercises interactive surfaces on the SOLID principles site.
 * Run: npm run test:e2e
 */
import { chromium } from 'playwright';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:4321/solid-principles-guide';
const SLUGS = [
  'single-responsibility',
  'open-closed',
  'liskov-substitution',
  'interface-segregation',
  'dependency-inversion',
];

const issues = [];

function record(severity, area, message) {
  issues.push({ severity, area, message });
  console.log(`[${severity}] ${area}: ${message}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  if (!title.includes('SOLID')) {
    record('HIGH', 'Home', `Unexpected title: ${title}`);
  }

  const cardCount = await page.locator('.pattern-card').count();
  if (cardCount !== 5) {
    record('HIGH', 'Home', `Expected 5 principle cards, found ${cardCount}`);
  }

  await page.getByLabel('Main').getByRole('link', { name: 'Principles', exact: true }).click();
  await page.waitForTimeout(200);
  await page.getByRole('link', { name: 'Finder', exact: true }).click();

  for (const letter of ['S', 'O', 'L', 'I', 'D']) {
    await page.getByRole('button', { name: letter, exact: true }).click();
    const visible = await page.locator('.pattern-card:not(.hidden)').count();
    if (visible !== 1) {
      record('HIGH', 'Filters', `${letter} filter shows ${visible} cards, expected 1`);
    }
  }
  await page.getByRole('button', { name: 'All' }).click();

  for (const slug of SLUGS) {
    await page.goto(`${BASE}/principles/${slug}/`, { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    if (!body.includes('Real-life analogy')) {
      record('HIGH', slug, 'Missing analogy section');
    }
    if (!body.includes('The problem')) {
      record('HIGH', slug, 'Missing problem section');
    }
    const jumps = page.locator('nav[aria-label="Page sections"] a.section-jump');
    if (await jumps.count() !== 7) {
      record('HIGH', slug, `Expected 7 section jumps, got ${await jumps.count()}`);
    }
    const toggle = page.locator('[data-code-toggle]');
    if (await toggle.count() === 0) {
      record('HIGH', slug, 'Code toggle missing');
    }
    if (await page.locator('[data-oc-frame]').count() === 0) {
      record('HIGH', slug, 'Code runner missing');
    }
  }

  await browser.close();

  console.log('\n--- E2E SUMMARY ---');
  console.log(`Issues: ${issues.length}`);
  const high = issues.filter((i) => i.severity === 'HIGH');
  if (high.length) {
    high.forEach((i) => console.error(`  [${i.area}] ${i.message}`));
    process.exit(1);
  }
  console.log('All checks passed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

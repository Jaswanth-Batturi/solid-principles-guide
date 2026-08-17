/**
 * Deep E2E audit — content, interactions, UX, and accessibility checks.
 */
import { chromium } from 'playwright';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:4322/solid-principles-guide';
const SLUGS = [
  'single-responsibility',
  'open-closed',
  'liskov-substitution',
  'interface-segregation',
  'dependency-inversion',
];

const STALE = ['without the pattern', 'skip the pattern', 'With the pattern', 'Pattern finder'];
const REQUIRED_HEADINGS = [
  'Real-life analogy',
  'The problem',
  'Code: problem vs fix',
  'Without vs with the principle',
  'Run it',
  'When to use or skip',
  'Quiz',
];

const issues = [];
const record = (severity, area, msg) => {
  issues.push({ severity, area, msg });
  console.log(`[${severity}] ${area}: ${msg}`);
};

async function testHomepage(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  if (!(await page.title()).includes('SOLID')) record('HIGH', 'Home', 'Bad title');

  const body = await page.locator('body').innerText();
  for (const stale of STALE) {
    if (body.includes(stale)) record('HIGH', 'Home', `Stale copy: "${stale}"`);
  }

  if (await page.locator('.principle-card').count() !== 5) {
    record('HIGH', 'Home', 'Expected 5 cards');
  }

  // Search
  await page.locator('#principle-search').fill('liskov');
  await page.waitForTimeout(100);
  if (await page.locator('.principle-card:not(.hidden)').count() !== 1) {
    record('HIGH', 'Home', 'Search "liskov" failed');
  }
  await page.locator('#principle-search').fill('zzzz');
  await page.waitForTimeout(100);
  if (!(await page.locator('#search-empty:not(.hidden)').isVisible())) {
    record('HIGH', 'Home', 'Empty search state missing');
  }
  await page.locator('#principle-search').fill('');

  // Letter filters
  for (const letter of ['S', 'O', 'L', 'I', 'D']) {
    await page.getByRole('button', { name: letter, exact: true }).click();
    if (await page.locator('.principle-card:not(.hidden)').count() !== 1) {
      record('HIGH', 'Home', `Filter ${letter} wrong count`);
    }
  }
  await page.getByRole('button', { name: 'All' }).click();

  // Finder chips
  const chips = page.locator('[data-example]');
  for (let i = 0; i < await chips.count(); i++) {
    await chips.nth(i).click();
    await page.waitForTimeout(80);
    if (!(await page.locator('#finder-results a').count())) {
      record('HIGH', 'Finder', `Chip ${i} produced no result link`);
    }
  }

  // Nav links
  // SOLID acronym quick links
  const acronymLinks = page.locator('nav[aria-label="SOLID acronym — jump to a principle"] a');
  if (await acronymLinks.count() !== 5) {
    record('HIGH', 'Home', 'SOLID acronym nav should have 5 links');
  }
  await acronymLinks.first().click();
  if (!page.url().includes('single-responsibility')) {
    record('HIGH', 'Home', 'SOLID acronym link failed');
  }
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
}

async function testPrinciplePage(page, slug) {
  await page.goto(`${BASE}/principles/${slug}/`, { waitUntil: 'domcontentloaded' });
  const body = await page.locator('body').innerText();

  for (const stale of STALE) {
    if (body.includes(stale)) record('HIGH', slug, `Stale copy: "${stale}"`);
  }
  for (const h of REQUIRED_HEADINGS) {
    if (!body.includes(h)) record('HIGH', slug, `Missing heading: ${h}`);
  }

  // Scene step labels
  if (!body.toLowerCase().includes('what goes wrong without the principle')) {
    record('HIGH', slug, 'Wrong scene step label');
  }

  // Code toggle
  const toggle = page.locator('[data-code-toggle]');
  await toggle.getByRole('tab', { name: 'Fixed' }).click();
  if (!(await toggle.locator('[data-panel="after"]').isVisible())) {
    record('HIGH', slug, 'Fixed tab broken');
  }
  await toggle.getByRole('tab', { name: 'Problem' }).click();

  // Copy button
  await toggle.locator('[data-copy]').click();
  await page.waitForTimeout(200);

  // Load in runner
  await toggle.getByRole('tab', { name: 'Problem' }).click();
  await toggle.locator('[data-load-runner]').click();
  await page.waitForTimeout(300);
  const status = await page.locator('[data-runner-status]').innerText();
  if (!status.includes('Ready')) record('MED', slug, `Runner status after load: ${status}`);

  // Expected output visible
  if (!body.includes('Expected output:')) {
    record('HIGH', slug, 'Expected output not shown in Run it');
  }

  // tryItSteps visible (Run ▶)
  if (!body.includes('Run ▶')) {
    record('HIGH', slug, 'tryItSteps hint missing');
  }

  // Section jumps
  const jumps = page.locator('nav[aria-label="Page sections"] a.section-jump');
  if (await jumps.count() !== 7) record('HIGH', slug, 'Section nav count wrong');

  // Quiz flow
  const opts = page.locator('[data-quiz] .quiz-option');
  if (await opts.count() < 2) record('HIGH', slug, 'Quiz options missing');
  await opts.first().click();
  await page.locator('[data-quiz-next]').click();
  const opts2 = page.locator('[data-quiz] .quiz-option');
  if (await opts2.count() > 0) await opts2.first().click();
  await page.locator('[data-quiz-next]').click();
  if (!(await page.locator('[data-quiz-score]').isVisible())) {
    record('HIGH', slug, 'Quiz score not shown');
  }

  // Related links use base path
  const links = await page.locator('a[href]').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  for (const href of links) {
    if (href?.startsWith('/principles/')) record('HIGH', slug, `Absolute link: ${href}`);
  }

  // SVG illustration
  if (await page.locator('#story svg').count() === 0) {
    record('HIGH', slug, 'Missing illustration');
  }
}

async function testMobile(page) {
  const mobile = await chromium.launch({ headless: true });
  const ctx = await mobile.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/principles/open-closed/`, { waitUntil: 'domcontentloaded' });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (overflow) record('HIGH', 'Mobile', 'Horizontal overflow on OCP page');
  await mobile.close();
}

async function test404(page) {
  await page.goto(`${BASE}/principles/not-real/`, { waitUntil: 'domcontentloaded' });
  const body = await page.locator('body').innerText();
  if (!body.match(/404|not found/i)) record('HIGH', '404', '404 page broken');
  if (body.includes('pattern library')) record('HIGH', '404', 'Stale 404 copy');
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();

  console.log(`Deep audit: ${BASE}\n`);
  await testHomepage(page);
  for (const slug of SLUGS) await testPrinciplePage(page, slug);
  await test404(page);
  await browser.close();
  await testMobile();

  console.log('\n--- DEEP AUDIT SUMMARY ---');
  console.log(`Issues: ${issues.length}`);
  const high = issues.filter((i) => i.severity === 'HIGH');
  if (high.length) {
    high.forEach((i) => console.error(`  [${i.area}] ${i.msg}`));
    process.exit(1);
  }
  console.log('All deep audit checks passed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

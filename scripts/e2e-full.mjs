/**
 * Full E2E — every principle page and interactive surface.
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

const SECTION_HEADINGS = ['Real-life analogy', 'Without vs with the principle', 'Code: problem vs fix', 'Run it', 'Quiz'];
const SECTION_IDS = ['story', 'problem', 'code', 'tradeoffs', 'run', 'decision', 'quiz'];

const issues = [];
const record = (severity, area, msg) => {
  issues.push({ severity, area, msg });
  console.log(`[${severity}] ${area}: ${msg}`);
};

async function completeQuiz(page, slug) {
  const quiz = page.locator('[data-quiz]');
  if (await quiz.count() === 0) {
    record('HIGH', slug, 'Quiz container missing');
    return;
  }
  const opts = page.locator('[data-quiz] .quiz-option');
  if (await opts.count() < 2) {
    record('HIGH', slug, 'Quiz has fewer than 2 options');
    return;
  }
  await opts.first().click();
  const next = page.locator('[data-quiz-next]');
  await next.click();
  const opts2 = page.locator('[data-quiz] .quiz-option');
  if (await opts2.count() > 0) await opts2.first().click();
  await next.click();
  const score = page.locator('[data-quiz-score]');
  if (!(await score.isVisible())) {
    record('HIGH', slug, 'Quiz score not shown');
  }
}

async function testCodeToggle(page, slug) {
  const toggle = page.locator('[data-code-toggle]');
  if (await toggle.count() === 0) {
    record('HIGH', slug, 'Code toggle missing');
    return;
  }
  const problem = toggle.getByRole('tab', { name: 'Problem' });
  const fixed = toggle.getByRole('tab', { name: 'Fixed' });
  if (await problem.getAttribute('aria-selected') !== 'true') {
    record('HIGH', slug, 'Default tab should be Problem');
  }
  await fixed.click();
  if (!(await toggle.locator('[data-panel="after"]').isVisible())) {
    record('HIGH', slug, 'Fixed panel not visible');
  }
  const beforeRaw = await toggle.getAttribute('data-before-raw');
  const afterRaw = await toggle.getAttribute('data-after-raw');
  if (!beforeRaw?.trim() || !afterRaw?.trim()) {
    record('HIGH', slug, 'Missing raw code data');
  }
  if (beforeRaw === afterRaw) {
    record('HIGH', slug, 'Problem and Fixed code identical');
  }
}

async function testPrinciplePage(page, slug) {
  const res = await page.goto(`${BASE}/principles/${slug}/`, { waitUntil: 'domcontentloaded' });
  if (!res || res.status() !== 200) {
    record('HIGH', slug, `HTTP ${res?.status()}`);
    return;
  }

  const body = await page.locator('body').innerText();
  for (const label of SECTION_HEADINGS) {
    if (!body.includes(label)) record('HIGH', slug, `Missing heading: ${label}`);
  }

  if (await page.locator('#story svg').count() === 0) {
    record('HIGH', slug, 'Missing SVG illustration');
  }

  for (const id of SECTION_IDS) {
    if (await page.locator(`#${id}`).count() === 0) record('HIGH', slug, `Missing #${id}`);
  }

  const jumps = page.locator('nav[aria-label="Page sections"] a.section-jump');
  if (await jumps.count() !== 7) {
    record('HIGH', slug, `Expected 7 section jumps, got ${await jumps.count()}`);
  }

  await testCodeToggle(page, slug);
  await completeQuiz(page, slug);

  if (!body.includes('Expected output:')) {
    record('MED', slug, 'Expected output not visible');
  }

  const links = await page.locator('a[href]').evaluateAll((els) =>
    els.map((a) => a.getAttribute('href')),
  );
  for (const href of links) {
    if (href?.startsWith('/principles/')) {
      record('HIGH', slug, `Broken absolute link: ${href}`);
    }
  }
}

async function testHomepage(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  if (!(await page.title()).includes('SOLID')) {
    record('HIGH', 'Home', `Bad title: ${await page.title()}`);
  }
  if (await page.locator('.pattern-card').count() !== 5) {
    record('HIGH', 'Home', 'Not 5 principle cards');
  }

  await page.locator('#pattern-search').fill('responsibility');
  await page.waitForTimeout(120);
  if (await page.locator('.pattern-card:not(.hidden)').count() < 1) {
    record('HIGH', 'Home', 'Search failed');
  }
  await page.locator('#pattern-search').fill('');

  const chips = page.locator('[data-example]');
  for (let i = 0; i < await chips.count(); i++) {
    await chips.nth(i).click();
    await page.waitForTimeout(80);
    if (!(await page.locator('#finder-results').innerText()).trim()) {
      record('HIGH', 'Finder', `Chip ${i} no results`);
    }
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();

  console.log(`Testing ${BASE}\n`);
  await testHomepage(page);

  for (const slug of SLUGS) {
    await testPrinciplePage(page, slug);
  }

  await browser.close();

  console.log('\n--- FULL E2E SUMMARY ---');
  console.log(`Principles tested: ${SLUGS.length}`);
  console.log(`Issues: ${issues.length}`);

  const high = issues.filter((i) => i.severity === 'HIGH');
  if (high.length) {
    high.forEach((i) => console.error(`  [${i.area}] ${i.msg}`));
    process.exit(1);
  }
  console.log('All checks passed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

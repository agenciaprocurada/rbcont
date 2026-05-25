import { PrismaClient } from '@prisma/client';

const OLD_URL = process.env.OLD_DATABASE_URL;
const NEW_URL = process.env.NEW_DATABASE_URL;

if (!OLD_URL || !NEW_URL) {
  console.error('Missing OLD_DATABASE_URL or NEW_DATABASE_URL env vars.');
  process.exit(1);
}

const src = new PrismaClient({ datasources: { db: { url: OLD_URL } } });
const dst = new PrismaClient({ datasources: { db: { url: NEW_URL } } });

const BATCH = 500;

async function copyTable(label, fetchPage, insertMany) {
  let offset = 0;
  let total = 0;
  while (true) {
    const rows = await fetchPage(offset, BATCH);
    if (rows.length === 0) break;
    await insertMany(rows);
    total += rows.length;
    offset += rows.length;
    process.stdout.write(`  ${label}: ${total}\r`);
    if (rows.length < BATCH) break;
  }
  console.log(`  ${label}: ${total} ✓                `);
  return total;
}

async function main() {
  console.log('Source:', new URL(OLD_URL).host);
  console.log('Dest:  ', new URL(NEW_URL).host);
  console.log('');

  const summary = {};

  // Order matters: parents before children.
  summary.users = await copyTable(
    'users',
    (skip, take) => src.user.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.user.createMany({ data: rows, skipDuplicates: true })
  );

  summary.categories = await copyTable(
    'categories',
    (skip, take) => src.category.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.category.createMany({ data: rows, skipDuplicates: true })
  );

  summary.articles = await copyTable(
    'articles',
    (skip, take) => src.article.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.article.createMany({ data: rows, skipDuplicates: true })
  );

  summary.support_blocks = await copyTable(
    'support_blocks',
    (skip, take) => src.supportBlock.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.supportBlock.createMany({ data: rows, skipDuplicates: true })
  );

  summary.highlights = await copyTable(
    'highlights',
    (skip, take) => src.highlight.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.highlight.createMany({ data: rows, skipDuplicates: true })
  );

  summary.article_views = await copyTable(
    'article_views',
    (skip, take) => src.articleView.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.articleView.createMany({ data: rows, skipDuplicates: true })
  );

  summary.favorites = await copyTable(
    'favorites',
    (skip, take) => src.favorite.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.favorite.createMany({ data: rows, skipDuplicates: true })
  );

  summary.search_activities = await copyTable(
    'search_activities',
    (skip, take) => src.searchActivity.findMany({ skip, take, orderBy: { id: 'asc' } }),
    (rows) => dst.searchActivity.createMany({ data: rows, skipDuplicates: true })
  );

  console.log('\nSource vs Dest row counts:');
  const checks = [
    ['users', () => src.user.count(), () => dst.user.count()],
    ['categories', () => src.category.count(), () => dst.category.count()],
    ['articles', () => src.article.count(), () => dst.article.count()],
    ['support_blocks', () => src.supportBlock.count(), () => dst.supportBlock.count()],
    ['highlights', () => src.highlight.count(), () => dst.highlight.count()],
    ['article_views', () => src.articleView.count(), () => dst.articleView.count()],
    ['favorites', () => src.favorite.count(), () => dst.favorite.count()],
    ['search_activities', () => src.searchActivity.count(), () => dst.searchActivity.count()],
  ];
  let mismatch = false;
  for (const [name, s, d] of checks) {
    const [sc, dc] = await Promise.all([s(), d()]);
    const mark = sc === dc ? '✓' : '✗';
    if (sc !== dc) mismatch = true;
    console.log(`  ${name.padEnd(20)} src=${sc}  dst=${dc}  ${mark}`);
  }

  if (mismatch) {
    console.error('\nWARNING: row counts differ between source and destination.');
    process.exitCode = 2;
  } else {
    console.log('\nAll tables match.');
  }
}

main()
  .catch((e) => {
    console.error('\nCopy failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await src.$disconnect();
    await dst.$disconnect();
  });

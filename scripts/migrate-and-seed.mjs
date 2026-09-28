import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('[migrate] Error: No database connection string found in environment.');
  process.exit(1);
}

async function run() {
  console.log('[migrate] Connecting to PostgreSQL database...');
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('[migrate] Connected successfully.');

    const migrationFile = path.join(rootDir, 'supabase', 'migrations', '20260928000000_complete_cms_entities.sql');
    console.log(`[migrate] Reading migration file: ${migrationFile}`);
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('[migrate] Executing migration SQL...');
    await client.query(sql);
    console.log('[migrate] Migration executed successfully.');

    // Verify row counts
    const tables = ['services', 'industries', 'projects', 'team_members', 'testimonials', 'partners', 'statistics', 'categories', 'articles', 'faqs'];
    console.log('\n--- VERIFICATION OF LIVE CMS TABLES ---');
    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) as count FROM public.${table};`);
        console.log(`  • ${table.padEnd(16)}: ${res.rows[0].count} rows`);
      } catch (err) {
        console.log(`  • ${table.padEnd(16)}: query failed (${err.message})`);
      }
    }
    console.log('--------------------------------------\n');
  } catch (err) {
    console.error('[migrate] Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

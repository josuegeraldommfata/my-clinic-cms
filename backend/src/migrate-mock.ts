#!/usr/bin/env bun
// Script backup: sempre atualiza DB com mockData atual
import { defaultSiteData } from '../../src/data/mockData.js';
import postgres from 'bun:pg';

const PG_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '32080910',
  database: 'dentista',
};

async function migrate() {
  const client = new postgres.PGClient(PG_CONFIG);
  await client.connect();

  console.log('🔄 Migrando mockData → PostgreSQL...');

  // LIMPA e recria (para dev)
  await client.queryObject('TRUNCATE site_blog, site_identity, site_theme, site_navbar, site_home, site_about, site_schedule, site_contact, site_footer, site_config RESTART IDENTITY CASCADE');

  const configRes = await client.queryObject('INSERT INTO site_config DEFAULT VALUES RETURNING id');
  const configId = configRes.rows[0].id;

  const data = defaultSiteData;

  // IDENTITY
  await client.queryObject(`
    INSERT INTO site_identity (config_id, name, crm, specialty, photo, logo)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [configId, data.identity.name, data.identity.crm, data.identity.specialty, data.identity.photo, data.identity.logo]);

  // THEME
  await client.queryObject(`
    INSERT INTO site_theme (config_id, primary_color, secondary_color, accent_color, background_color, foreground_color, card_color, muted_color, footer_bg_color, footer_text_color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `, [configId, ...Object.values(data.theme)]);

  // ... outros INSERTs similares

  console.log('✅ Migração completa!');
  await client.end();
}

migrate();

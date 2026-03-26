#!/usr/bin/env bun
import postgres from 'bun:pg';
import { defaultSiteData } from '../../src/data/mockData.js';

const PG_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '32080910',
  database: 'dentista',
};

async function init() {
  const client = new postgres.PGClient(PG_CONFIG);
  await client.connect();

  // Criar site_config se não existir
  const configRes = await client.queryObject('SELECT id FROM site_config LIMIT 1');
  let configId: string;

  if (configRes.rows.length === 0) {
    const res = await client.queryObject('INSERT INTO site_config (id) VALUES (gen_random_uuid()) RETURNING id');
    configId = res.rows[0].id;
    console.log(`✅ Config criada: ${configId}`);
  } else {
    configId = configRes.rows[0].id;
    console.log(`✅ Config encontrada: ${configId}`);
  }

  // Migrar dados mock para DB (somente se tabelas vazias)
  const data = defaultSiteData;

  // Helper UPSERT
  const upsert = async (table: string, data: any) => {
    await client.queryObject(
      `INSERT INTO ${table} (config_id, ${Object.keys(data).join(', ')})
       VALUES ($1, ${Object.keys(data).map((_, i) => `$${i+2}`).join(', ')})
       ON CONFLICT (config_id) DO NOTHING`,
      [configId, ...Object.values(data)]
    );
  };

  // IDENTITY
  await upsert('site_identity', {
    name: data.identity.name,
    crm: data.identity.crm,
    specialty: data.identity.specialty,
    photo: data.identity.photo,
    logo: data.identity.logo
  });

  // THEME
  await upsert('site_theme', data.theme);

  // NAVBAR
  await upsert('site_navbar', {
    cta_text: data.navbar.ctaText,
    links: JSON.stringify(data.navbar.links)
  });

  // HOME (JSONB)
  await upsert('site_home', {
    hero: JSON.stringify(data.home.hero),
    services: JSON.stringify(data.home.services.items),
    differentials: JSON.stringify(data.home.differentials.items),
    cta: JSON.stringify(data.home.cta)
  });

  // ABOUT
  await upsert('site_about', {
    bio: data.about.bio,
    education: JSON.stringify(data.about.education),
    experience: JSON.stringify(data.about.experience)
  });

  // SCHEDULE
  await upsert('site_schedule', data.schedule);

  // CONTACT
  await upsert('site_contact', {
    phone: data.contact.phone,
    whatsapp: data.contact.whatsapp,
    email: data.contact.email,
    address: data.contact.address,
    map_url: data.contact.mapUrl,
    social: JSON.stringify(data.contact.social)
  });

  // FOOTER
  await upsert('site_footer', {
    text: data.footer.text,
    links: JSON.stringify(data.footer.links),
    social: JSON.stringify(data.footer.social)
  });

  // BLOG (múltiplos)
  for (const post of data.blog) {
    await client.queryObject(`
      INSERT INTO site_blog (config_id, title, image, summary, content, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, [configId, post.title, post.image, post.summary, post.content, post.date]);
  }

  console.log('🎉 Todos dados mock migrados para PostgreSQL!');
  await client.end();
}

init().catch(console.error);

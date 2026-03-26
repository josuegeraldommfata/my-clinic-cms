#!/usr/bin/env node
import { createServer } from 'http';
import { Pool } from 'pg';

import { defaultSiteData } from '../../src/data/mockData.js';

// Config PostgreSQL
const PG_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '32080910',
  database: 'dentista',
};

// Pool Node.js pg
const pool = new Pool(PG_CONFIG);
pool.on('error', (err: Error) => {
  console.error('PG Pool inesperado:', err.stack);
});

// Função para query com client
async function queryDB(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}


// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Middleware OPTIONS
if (req.method === 'OPTIONS') {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/:section
async function getSection(req: Request, pathname: string) {
  const section = pathname.split('/')[2];
  if (!section) return new Response('Seção não encontrada', { status: 400 });

  try {
    const configRes = await queryDB('SELECT id FROM site_config LIMIT 1');
    if (configRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Execute init-db.ts primeiro' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }


    if (configRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Init DB primeiro' }), { status: 404 });
    }

    const configId = configRes.rows[0].id;

    let result: any;

    switch (section) {
      case 'identity':
        result = await client.queryObject(
          'SELECT * FROM site_identity WHERE config_id = $1', [configId]
        );
        break;
      case 'theme':
        result = await client.queryObject(
          'SELECT * FROM site_theme WHERE config_id = $1', [configId]
        );
        break;
      case 'navbar':
        result = await client.queryObject(
          'SELECT * FROM site_navbar WHERE config_id = $1', [configId]
        );
        break;
      case 'home':
        result = await client.queryObject(
          'SELECT * FROM site_home WHERE config_id = $1', [configId]
        );
        break;
      case 'about':
        result = await client.queryObject(
          'SELECT * FROM site_about WHERE config_id = $1', [configId]
        );
        break;
      case 'schedule':
        result = await client.queryObject(
          'SELECT * FROM site_schedule WHERE config_id = $1', [configId]
        );
        break;
      case 'blog':
        result = await client.queryObject(
          'SELECT * FROM site_blog WHERE config_id = $1 ORDER BY date DESC', [configId]
        );
        break;
      case 'contact':
        result = await client.queryObject(
          'SELECT * FROM site_contact WHERE config_id = $1', [configId]
        );
        break;
      case 'footer':
        result = await client.queryObject(
          'SELECT * FROM site_footer WHERE config_id = $1', [configId]
        );
        break;
      default:
        return new Response('Seção inválida', { status: 400 });
    }

    return Response.json(result.rows[0] || []);
  } catch (error: any) {
    console.error('GET erro:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PUT /api/:section
async function updateSection(req: Request) {
  const url = new URL(req.url);
  const section = url.pathname.split('/')[2];

  if (!section) return new Response('Seção não encontrada', { status: 400 });

  try {
    const body = await req.json();
    const client = await getPool();
    const configRes = await client.queryObject('SELECT id FROM site_config LIMIT 1');

    if (configRes.rows.length === 0) {
      return new Response('Config não encontrada', { status: 404 });
    }

    const configId = configRes.rows[0].id;

    // UPSERT (INSERT or UPDATE)
    const tableMap: any = {
      identity: 'site_identity',
      theme: 'site_theme',
      navbar: 'site_navbar',
      home: 'site_home',
      about: 'site_about',
      schedule: 'site_schedule',
      contact: 'site_contact',
      footer: 'site_footer',
    };

    if (!tableMap[section]) {
      return new Response('Tabela inválida', { status: 400 });
    }

    // UPDATE ou INSERT
    await client.queryObject(
      `INSERT INTO ${tableMap[section]} (config_id, ${Object.keys(body).join(', ')})
       VALUES ($1, ${Object.keys(body).map((_, i) => `$${i+2}`).join(', ')})
       ON CONFLICT (config_id)
       DO UPDATE SET ${Object.keys(body).map((k, i) => `${k} = EXCLUDED.${k}`).join(', ')}`,
      [configId, ...Object.values(body)]
    );

    return Response.json({ success: true, section });
  } catch (error: any) {
    console.error('PUT erro:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Server
const server = serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS
    if (req.method === 'OPTIONS') return cors();

    // Rotas API
    if (url.pathname.startsWith('/api/')) {
      if (req.method === 'GET') return getSection(req);
      if (req.method === 'PUT') return updateSection(req);
      return new Response('Method não permitido', { status: 405 });
    }

    // Health check
    if (url.pathname === '/health') {
      return Response.json({ status: 'OK', db: await getPool() ? 'connected' : 'error' });
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`🚀 Backend rodando em http://localhost:${server.port}`);
console.log('Endpoints: GET/PUT /api/[identity|theme|navbar|home|about|schedule|blog|contact|footer]');
console.log('Health: http://localhost:3001/health');

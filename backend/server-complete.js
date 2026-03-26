#!/usr/bin/env node
const http = require('http');
const { Pool } = require('pg');

const PG_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '32080910',
  database: 'dentista',
  max: 20,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(PG_CONFIG);
pool.on('error', (err) => console.error('PG error:', err));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function queryDB(query, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(query, params);
  } finally {
    client.release();
  }
}

const requestHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    try {
      await queryDB('SELECT 1');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'OK', db: 'connected' }));
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', db: 'disconnected' }));
    }
    return;
  }

  if (!url.pathname.startsWith('/api/')) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const section = url.pathname.slice(5);

  if (req.method === 'GET') {
    try {
      const configRes = await queryDB('SELECT id FROM site_config LIMIT 1');
      if (configRes.rows.length === 0) {
        res.writeHead(404);
        res.end('Execute npm run db:init');
        return;
      }
      const configId = configRes.rows[0].id;

      let result;
      switch (section) {
        case 'identity':
          result = await queryDB('SELECT * FROM site_identity WHERE config_id = $1', [configId]);
          break;
        case 'theme':
          result = await queryDB('SELECT * FROM site_theme WHERE config_id = $1', [configId]);
          break;
        case 'navbar':
          result = await queryDB('SELECT * FROM site_navbar WHERE config_id = $1', [configId]);
          break;
        case 'home':
          result = await queryDB('SELECT * FROM site_home WHERE config_id = $1', [configId]);
          break;
        case 'about':
          result = await queryDB('SELECT * FROM site_about WHERE config_id = $1', [configId]);
          break;
        case 'schedule':
          result = await queryDB('SELECT * FROM site_schedule WHERE config_id = $1', [configId]);
          break;
        case 'blog':
          result = await queryDB('SELECT * FROM site_blog WHERE config_id = $1 ORDER BY date DESC', [configId]);
          break;
        case 'contact':
          result = await queryDB('SELECT * FROM site_contact WHERE config_id = $1', [configId]);
          break;
        case 'footer':
          result = await queryDB('SELECT * FROM site_footer WHERE config_id = $1', [configId]);
          break;
        default:
          res.writeHead(400);
          res.end('Seção inválida');
          return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      console.error('GET error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const configRes = await queryDB('SELECT id FROM site_config LIMIT 1');
        if (configRes.rows.length === 0) {
          res.writeHead(404);
          res.end('Config não encontrada');
          return;
        }
        const configId = configRes.rows[0].id;

        const tableMap = {
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
          res.writeHead(400);
          res.end('Seção inválida');
          return;
        }

        const fields = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = Object.keys(data).map((_, i) => `$${i+2}`).join(', ');
        const updates = Object.keys(data).map(k => `${k} = EXCLUDED.${k}`).join(', ');

        await queryDB(`
          INSERT INTO ${tableMap[section]} (config_id, ${fields})
          VALUES ($1, ${placeholders})
          ON CONFLICT (config_id) DO UPDATE SET ${updates}
        `, [configId, ...values]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, section }));
      } catch (err) {
        console.error('PUT error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(405);
    res.end('Method não permitido');
  }
};

const server = http.createServer(requestHandler);

server.listen(3001, () => {
  console.log('🚀 Backend NPM rodando http://localhost:3001');
  console.log('npm run dev | npm run db:init');
});


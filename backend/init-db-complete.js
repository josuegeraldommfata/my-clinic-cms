#!/usr/bin/env node
const { Pool } = require('pg');
const fs = require('fs');

const PG_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '32080910',
  database: 'dentista',
};

const pool = new Pool(PG_CONFIG);

async function initDB() {
  const client = await pool.connect();

  try {
    // Criar config se não existir
    const configRes = await client.query('SELECT id FROM site_config LIMIT 1');
    let configId;

    if (configRes.rows.length === 0) {
      const res = await client.query('INSERT INTO site_config DEFAULT VALUES RETURNING id');
      configId = res.rows[0].id;
      console.log('✅ Config criada:', configId);
    } else {
      configId = configRes.rows[0].id;
      console.log('✅ Config encontrada:', configId);
    }

    console.log('🎉 Banco PostgreSQL pronto para CMS!');
  } catch (err) {
    console.error('Erro init:', err);
  } finally {
    client.release();
  }
}

initDB().then(() => pool.end());


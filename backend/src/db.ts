import { drizzle } from 'drizzle-orm/bun-pg';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/bun-pg/migrator';
import * as schema from './schema.js';

// Configuração PostgreSQL
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '32080910',
  database: 'dentista',
});

export const db = drizzle(pool, { schema });

// Função para inicializar/migrar
export async function initDb() {
  console.log('🚀 Conectando ao PostgreSQL...');
  try {
    await pool.connect();
    console.log('✅ Conexão OK!');

    // Criar tabelas se não existirem
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    console.log('✅ Banco pronto!');
  } catch (error) {
    console.error('❌ Erro conexão PG:', error);
    process.exit(1);
  }
}

// Queries para cada seção
export async function getSection(section: string) {
  const configIdResult = await db.execute(sql`
    SELECT id FROM site_config LIMIT 1
  `);

  if (configIdResult.rows.length === 0) {
    throw new Error('Configuração não encontrada. Execute init-data primeiro.');
  }

  const configId = configIdResult.rows[0].id;

  switch (section) {
    case 'identity':
      return await db.query.site_identity.findFirst({ where: eq(schema.site_identity.config_id, configId) });

    case 'theme':
      return await db.query.site_theme.findFirst({ where: eq(schema.site_theme.config_id, configId) });

    case 'navbar':
      return await db.query.site_navbar.findFirst({ where: eq(schema.site_navbar.config_id, configId) });

    case 'home':
      return await db.query.site_home.findFirst({ where: eq(schema.site_home.config_id, configId) });

    case 'about':
      return await db.query.site_about.findFirst({ where: eq(schema.site_about.config_id, configId) });

    case 'schedule':
      return await db.query.site_schedule.findFirst({ where: eq(schema.site_schedule.config_id, configId) });

    case 'blog':
      return await db.query.site_blog.findMany({ where: eq(schema.site_blog.config_id, configId), orderBy: desc(schema.site_blog.date) });

    case 'contact':
      return await db.query.site_contact.findFirst({ where: eq(schema.site_contact.config_id, configId) });

    case 'footer':
      return await db.query.site_footer.findFirst({ where: eq(schema.site_footer.config_id, configId) });

    default:
      throw new Error(`Seção ${section} não encontrada`);
  }
}

export async function updateSection(section: string, data: any) {
  const configIdResult = await db.execute(sql`
    SELECT id FROM site_config LIMIT 1
  `);

  if (configIdResult.rows.length === 0) {
    throw new Error('Configuração não encontrada');
  }

  const configId = configIdResult.rows[0].id;

  switch (section) {
    case 'identity':
      return await db.update(schema.site_identity)
        .set(data)
        .where(eq(schema.site_identity.config_id, configId));

    case 'theme':
      return await db.update(schema.site_theme)
        .set(data)
        .where(eq(schema.site_theme.config_id, configId));

    // ... outros cases similares
  }
}

-- Schema PostgreSQL para CMS Clínica Médica
-- Banco: dentista | User: postgres | Senha: 32080910

-- Habilitar JSONB
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela principal de configuração (1 linha)
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 01. IDENTITY
CREATE TABLE IF NOT EXISTS site_identity (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  crm VARCHAR(50),
  specialty VARCHAR(255),
  photo TEXT,
  logo TEXT,
  PRIMARY KEY (config_id)
);

-- 02. THEME
CREATE TABLE IF NOT EXISTS site_theme (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7) NOT NULL,
  background_color VARCHAR(7) NOT NULL,
  foreground_color VARCHAR(7) NOT NULL,
  card_color VARCHAR(7) NOT NULL,
  muted_color VARCHAR(7) NOT NULL,
  footer_bg_color VARCHAR(7) NOT NULL,
  footer_text_color VARCHAR(7) NOT NULL,
  PRIMARY KEY (config_id)
);

-- 03. NAVBAR
CREATE TABLE IF NOT EXISTS site_navbar (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  cta_text VARCHAR(255),
  links JSONB NOT NULL DEFAULT '[]'::JSONB,
  PRIMARY KEY (config_id)
);

-- 04. HOME (seções complexas como JSONB)
CREATE TABLE IF NOT EXISTS site_home (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  hero JSONB NOT NULL DEFAULT '{}'::JSONB,
  services JSONB NOT NULL DEFAULT '[]'::JSONB,
  differentials JSONB NOT NULL DEFAULT '[]'::JSONB,
  cta JSONB NOT NULL DEFAULT '{}'::JSONB,
  PRIMARY KEY (config_id)
);

-- 05. ABOUT
CREATE TABLE IF NOT EXISTS site_about (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  bio TEXT,
  education JSONB NOT NULL DEFAULT '[]'::JSONB,
  experience JSONB NOT NULL DEFAULT '[]'::JSONB,
  PRIMARY KEY (config_id)
);

-- 06. SCHEDULE
CREATE TABLE IF NOT EXISTS site_schedule (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  days VARCHAR(255),
  hours VARCHAR(255),
  address TEXT,
  whatsapp VARCHAR(20),
  phone VARCHAR(20),
  PRIMARY KEY (config_id)
);

-- 07. BLOG (posts individuais)
CREATE TABLE IF NOT EXISTS site_blog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  image TEXT,
  summary TEXT,
  content TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 08. CONTACT
CREATE TABLE IF NOT EXISTS site_contact (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  map_url TEXT,
  social JSONB NOT NULL DEFAULT '[]'::JSONB,
  PRIMARY KEY (config_id)
);

-- 09. FOOTER
CREATE TABLE IF NOT EXISTS site_footer (
  config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
  text TEXT,
  links JSONB NOT NULL DEFAULT '[]'::JSONB,
  social JSONB NOT NULL DEFAULT '[]'::JSONB,
  PRIMARY KEY (config_id)
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_blog_updated_at BEFORE UPDATE
  ON site_blog FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

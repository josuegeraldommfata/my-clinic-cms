# Backend CMS Clínica - Node.js + PostgreSQL

## 🚀 Iniciar

```bash
cd backend
npm install
npm run db:init
npm run dev
```

**URLs:**
- Health: http://localhost:3001/health
- API: http://localhost:3001/api/identity

## Estrutura

```
PostgreSQL: dentista
- 10 tabelas normalizadas
- Dados migrados do mockData

Node.js + pg (NPM)
- server-complete.js: API REST
- init-db-complete.js: Setup
```

## Teste Admin → Banco
1. Frontend: http://localhost:8080/admin/dashboard
2. Edita campo
3. Salva → PostgreSQL real ✅

**Produção:** `pm2 start npm --name "clinic-api" -- run dev`

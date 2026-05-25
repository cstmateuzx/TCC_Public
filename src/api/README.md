# API — BXD Tattoo Studio

Backend em Node.js + Express + SQLite para o frontend Svelte.

## Estrutura

```
src/api/
├── server.js          # Ponto de entrada (sobe o servidor)
├── app.js             # Configuração do Express e middlewares
├── config/            # Variáveis de ambiente e conexão com o banco
├── middleware/        # Autenticação JWT (usuário e administrador)
├── routes/            # Rotas por domínio (auth, usuários, serviços, etc.)
├── services/          # Lógica compartilhada (validação de credenciais)
├── db/schema.sql      # Esquema do banco SQLite
└── data/users.db      # Banco de dados (não versionado)
```

## Configuração

1. Copie o arquivo de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Edite `.env` e defina um `JWT_SECRET` seguro.

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Se ainda não existir o banco, crie a pasta e aplique o esquema:

   ```bash
   mkdir -p data
   sqlite3 data/users.db < db/schema.sql
   ```

## Executar

```bash
npm run dev    # desenvolvimento (nodemon)
npm start      # produção local
```

A API escuta na porta **3000** por padrão. O frontend deve apontar para `http://localhost:3000`.

## Rotas principais

| Método | Caminho | Autenticação |
|--------|---------|--------------|
| POST | `/api/login` | — |
| POST | `/api/logout` | — |
| GET | `/api/usuarios/me` | usuário |
| GET | `/api/adms/me` | administrador |
| POST | `/usuarios/novo` | — |
| GET/PUT/DELETE | `/usuarios`, `/usuarios/:id` | administrador |
| GET/POST/PUT/DELETE | `/servicos`, `/adms`, `/horarios` | conforme rota |

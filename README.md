# Task Manager - Fullstack (NestJS + Next.js)

Aplicação simples de gerenciamento de tarefas com autenticação JWT.

## Estrutura

```
backend/
  src/
    main.ts              # Inicialização do NestJS
    app.module.ts        # Módulo único (registra tudo)
    prisma.service.ts    # Conexão com banco de dados
    auth.controller.ts   # Rotas de login e registro
    auth.service.ts      # Lógica de autenticação + JWT
    auth.guard.ts        # Guard que valida o token JWT
    tasks.controller.ts  # Rotas de CRUD de tarefas
    tasks.service.ts     # Lógica de tarefas + Prisma
  prisma/
    schema.prisma        # Modelos User e Task

frontend/
  src/
    app/
      page.tsx           # Redirect para /login ou /tasks
      login/page.tsx     # Tela de login
      register/page.tsx  # Tela de registro
      tasks/page.tsx     # Tela de tarefas (CRUD completo)
    lib/
      api.ts             # Funções de chamada à API
```

## Como rodar

### 1. Banco de dados (PostgreSQL via Docker)

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

O backend roda em `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:3001`.

## Variáveis de ambiente

**Backend** — crie um `.env` em `backend/`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/teste_leek"
JWT_SECRET="segredo-jwt"
```

**Frontend** — usa `http://localhost:3000` por padrão. Para mudar, crie `.env.local` em `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

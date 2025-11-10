# {{NOME_DA_ESCOLA}} – Sistema Escolar Unificado

Portal completo para gestão escolar, biblioteca, licenças docentes e chamadas, com frontend Next.js 14 e backend NestJS + Prisma/PostgreSQL. Inclui autenticação JWT com cookies httpOnly, RBAC, seeds e infraestrutura Docker.

## Estrutura do monorepo

```
apps/
  api/        # API NestJS (Clean Architecture/Hexagonal)
  web/        # Frontend Next.js 14 App Router
packages/
  ui/         # Componentes compartilhados (shadcn inspired)
  eslint/     # Configuração padronizada de lint
prisma/       # Schema, migrations e seed
docs/         # Diagramas, coleção Postman, assets
```

## Pré-requisitos

- Node.js 20+
- npm 9+
- Docker + Docker Compose

## Variáveis de ambiente

Copie `.env.example` para `.env` (opcional). Os tokens `{{...}}` podem ser personalizados rapidamente ou substituídos por variáveis reais em produção.

```bash
cp .env.example .env
```

Variáveis principais:

- `NOME_DA_ESCOLA`, `LOGO_URL`, `CIDADE_UF`
- `ANO_LETIVO`, `REGRAS_EMPRESTIMO_ALUNO`, `REGRAS_EMPRESTIMO_PROFESSOR`
- `DATABASE_URL` para Prisma/PostgreSQL
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

## Execução com Docker

```bash
docker compose up --build
```

Serviços disponíveis:

- API: http://localhost:3333 (Swagger em `/docs`)
- Web: http://localhost:3000
- Banco: PostgreSQL em localhost:5432

Após subir os containers, rode as migrações e seeds (executado automaticamente no entrypoint local abaixo) ou manualmente:

```bash
npm install
npm run prisma:generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

## Execução local (sem Docker)

```bash
npm install
npm run dev:all
```

Isso executa `apps/api` em `:3333` e `apps/web` em `:3000` simultaneamente.

### Scripts úteis

- `npm run build` – build de API e Web
- `npm run test` – jest unit + e2e (API) + testing-library (Web)
- `npm run lint` – lint em todos os workspaces

## Credenciais de teste (seed)

| Perfil            | E-mail                    | Senha      |
|-------------------|---------------------------|------------|
| Administrador     | admin@escola.local        | Admin@123  |
| Bibliotecário     | biblioteca@escola.local   | Bibli@123  |
| Professor         | professor@escola.local    | Prof@123   |
| Aluno             | aluno@escola.local        | Aluno@123  |

## Recursos implementados

- Autenticação JWT Access/Refresh com cookies httpOnly e proteção CSRF
- RBAC com guardas para Administrador, Gestão, Bibliotecário, Professor, Aluno e Responsável
- Módulo Biblioteca com cálculo de prazos, status (No prazo, Vence hoje, Atrasado) e renovações
- Módulo Chamada (presenças P/F/A/J) com rascunho e export placeholder
- Licenças docentes com validação de anexos, fluxo rascunho → aprovação
- Gestão escolar: turmas, matrículas, avisos, documentos, parâmetros
- Logs de auditoria e configurações parametrizadas (tabela `settings`)
- Templates UI acessíveis, responsivos e com i18n pronto (pt-BR default)
- Notificações estruturadas (BullMQ/IORedis prontos para enfileirar)

## Diagramas e coleções

- ERD (Mermaid): `docs/diagram.mmd` – visualize em editores compatíveis (ex.: VS Code Mermaid, Mermaid Live Editor)
- Coleção Postman: `docs/postman_collection.json`

## Testes

```bash
npm run test --workspace apps/api       # unit + e2e (Supertest)
npm run test --workspace apps/web       # Testing Library
```

## Estrutura da API

Principais endpoints (Swagger autodocumentado):

- `POST /auth/login`, `POST /auth/refresh`, `POST /auth/forgot`
- `GET /users`, `POST /users` (Admin)
- `GET /library/works`, `POST /library/loans`, `POST /library/loans/:id/return`
- `POST /attendance/records`, `POST /attendance/records/:id/items`, `GET /attendance/stats/:studentId`
- `POST /leaves`, `POST /leaves/:id/approve`, `POST /leaves/:id/reject`
- `GET /documents`, `POST /documents`
- `GET /notices`, `POST /notices`

## Fluxos principais

1. **Login + Dashboard** – usuários autenticam-se via login (cookies httpOnly) e acessam cards de status.
2. **Biblioteca** – bibliotecário cadastra obras, exemplares e empresta via `/library/loans`. Status (no prazo, vence hoje, atrasado) alimentam notificações.
3. **Chamada** – professor cria registro `/attendance/records` e envia presença dos alunos.
4. **Licença docente** – professor abre solicitação, gestão aprova/reprova e notifica substituto.
5. **Documentos e avisos** – gestão publica documentos versionados e avisos segmentados.

## LGPD & Segurança

- RBAC mínimo, logs de auditoria (`audit_logs`)
- Cookies httpOnly + CSRF + Helmet + Rate limit
- Sanitização básica de uploads (placeholder) e política de backup via `settings`

## Dados seed adicionais

- Turma "1º Ano" com grade e matrícula de aluno exemplo
- Obra "Matemática Aplicada" + exemplar disponível (código PAT-001)
- Configuração de empréstimo com prazos customizáveis via `settings`

## Build & Deploy

- Docker multi-stage (Node 20) para API e Web
- `docker compose up --build` gera imagens `api` e `web`
- Pronto para CI/CD: execute `npm ci`, `npm run lint`, `npm run test`, `npm run build`

## Acessibilidade & i18n

- Layout semântico, cores contrastantes
- Foco visível, navegação por teclado
- Strings centralizadas e preparadas para pt-BR (hook i18n em `apps/web/lib`)

## Referências rápidas

- Swagger/OpenAPI: http://localhost:3333/docs
- Dashboard Web: http://localhost:3000/(dashboard)
- Login: http://localhost:3000/auth/login
- Seed script: `prisma/seed.ts`

---

Projeto desenvolvido por gpt-5-codex (OpenAI) para {{NOME_DA_ESCOLA}} – {{CIDADE/UF}}.

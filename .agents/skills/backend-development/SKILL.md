---
name: backend-development
description: >-
  Padrões de arquitetura e desenvolvimento backend do Rede Busca em Node.js,
  Express e TypeScript. Use esta skill ao criar ou modificar rotas,
  controllers, services, schemas Zod, middlewares, CORS ou configurações do
  servidor Express no diretório backend/.
---

# Backend Development — Rede Busca

Esta skill define a arquitetura e as convenções do servidor em `backend/`.

## Tecnologias Obrigatórias (Não Migrar para NestJS)

- O backend utiliza **Node.js + Express 5 + TypeScript** com **Prisma** (`@prisma/client`), **Zod**, **bcryptjs**, **jsonwebtoken**, **cors** e **dotenv**.
- **Preserve a stack existente**: **não migre para NestJS**, Fastify ou outro framework e não introduza decorators/DI containers que quebrem o padrão atual.

## Arquitetura de Monolito Modular

Organize cada domínio funcional como um módulo independente em `backend/src/modules/<modulo>/`, seguindo o modelo de `backend/src/modules/auth/`:

```text
backend/src/modules/<modulo>/
├── <modulo>.routes.ts       # Definição das rotas Express e middlewares
├── <modulo>.controller.ts   # Validação HTTP (Zod), status codes e tratamento de erros
├── <modulo>.service.ts      # Regras de negócio, acesso ao Prisma e erros de domínio
├── <modulo>.schema.ts       # Schemas Zod e tipos inferidos (z.infer)
└── <modulo>.middleware.ts   # Opcional: middlewares específicos do módulo
```

Registre as rotas do módulo em `backend/src/server.ts` sob o prefixo `/api/<modulo>`.

## Responsabilidades por Camada

1. **Routes (`*.routes.ts`)**: apenas mapeia verbos/caminhos HTTP, aplica middlewares (ex.: `authenticate` de `auth.middleware.ts`) e delega ao controller.
2. **Schemas (`*.schema.ts`)**: define validações com **Zod** (`req.body`, `req.params`, `req.query`) com mensagens claras em português e exporta tipos com `z.infer`.
3. **Controllers (`*.controller.ts`)**:
   - Valida entradas com `schema.safeParse(...)`.
   - Em falha de validação, retorna `400` no formato padronizado adotado em `auth.controller.ts`:
     ```json
     {
       "error": "Dados inválidos",
       "details": [{ "field": "campo", "message": "Mensagem de erro" }]
     }
     ```
   - Chama o `service`, converte erros de domínio em status HTTP apropriados e **nunca** chama `prisma` diretamente.
4. **Services (`*.service.ts`)**:
   - Contém regras de negócio, verificações de propriedade/autorização e queries usando `prisma` de `backend/src/config/prisma.ts`.
   - Usa `select` explícito nas consultas para jamais retornar campos sensíveis (como `password`).
   - Lança classes de erro de domínio tipadas (ex.: `DuplicateEmailError`) para o controller mapear para HTTP.

## HTTP, Status Codes, Headers e CORS

- Use métodos HTTP semânticos (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Códigos HTTP padrão: `200` (OK), `201` (Created), `204` (No Content), `400` (validação), `401` (não autenticado), `403` (sem permissão), `404` (não encontrado), `409` (conflito/duplicidade), `500` (erro interno sem expor stack trace).
- Mantenha `express.json()` e configure `cors` de forma segura (restringindo origens permitidas via ambiente em produção, sem abrir `*` quando houver credenciais ou políticas restritas).
- Exija `Content-Type: application/json` e `Authorization: Bearer <token>` nas rotas protegidas.

## Documentação REST

- Todo novo endpoint ou alteração de contrato deve manter a especificação **Swagger/OpenAPI** atualizada conforme a skill `api-documentation`.

## Verificação

Antes de encerrar mudanças no backend, execute a checagem de tipos TypeScript em `backend/`:

```bash
npx tsc --noEmit
```

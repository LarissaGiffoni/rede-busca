---
name: api-documentation
description: >-
  Padrões de documentação REST com Swagger/OpenAPI para o backend do Rede
  Busca. Use esta skill ao criar, alterar ou revisar endpoints, schemas Zod,
  códigos HTTP, autenticação JWT ou arquivos de especificação OpenAPI.
---

# API Documentation (Swagger / OpenAPI) — Rede Busca

Esta skill garante que todos os endpoints REST do backend (`backend/`) possuam documentação **Swagger/OpenAPI** clara, completa e sempre sincronizada com o código.

## Padrão OpenAPI

- Adote a especificação **OpenAPI 3.0+** (YAML/JSON ou JSDoc/geração alinhada aos schemas Zod, mantendo a stack Express + TypeScript).
- Organize endpoints por `tags` correspondentes aos módulos em `backend/src/modules/` (ex.: `Health`, `Auth`, `Publications`, `Search`).

## O que Documentar em Cada Endpoint

Para cada rota registrada em `backend/src/server.ts` e `backend/src/modules/*/*.routes.ts`, documente obrigatoriamente:

1. **Método HTTP e caminho completo** (ex.: `POST /api/auth/register`, `GET /api/auth/me`, `GET /health`).
2. **Resumo e descrição objetiva** da operação e regras de negócio relevantes.
3. **Autenticação JWT**:
   - Declare o esquema global em `components.securitySchemes`:
     ```yaml
     bearerAuth:
       type: http
       scheme: bearer
       bearerFormat: JWT
     ```
   - Aplique `security: [{ bearerAuth: [] }]` em todas as rotas protegidas pelo middleware `authenticate`.
   - Indique explicitamente rotas públicas (sem `security`).
4. **Parâmetros e Corpo (`requestBody`)**:
   - Documente `path`, `query` e `header` params com tipos, obrigatoriedade e limites.
   - Espelhe exatamente os campos, formatos, tamanhos mínimos/máximos e enums definidos nos schemas **Zod** (`*.schema.ts`).
5. **Schemas e Respostas por Código HTTP**:
   - Defina modelos reutilizáveis em `components.schemas` (ex.: `PublicUser`, `ValidationError`, `ErrorResponse`).
   - Documente todas as respostas possíveis: `200`, `201`, `204`, `400` (validação com `{ error, details: [{ field, message }] }`), `401` (JWT ausente/inválido/expirado), `403` (sem permissão/não proprietário), `404`, `409` (conflito, ex.: e-mail já cadastrado) e `500`.

## Privacidade e Dados Fictícios nos Exemplos

- Todos os exemplos (`example` / `examples`) na documentação OpenAPI devem usar **dados exclusivamente fictícios** (ex.: `maria.silva@exemplo.com`, UUIDs sintéticos, endereços fictícios).
- **Nunca** inclua tokens JWT reais, senhas reais, segredos de ambiente ou dados reais de pessoas desaparecidas.

## Regra de Sincronização Contínua

- A documentação faz parte da definição de pronto de qualquer alteração na API.
- Ao adicionar ou modificar `*.routes.ts`, `*.controller.ts` ou `*.schema.ts`, atualize imediatamente a especificação Swagger/OpenAPI correspondente na mesma tarefa e valide que o documento OpenAPI permanece sintaticamente válido e fiel aos retornos reais do controller.

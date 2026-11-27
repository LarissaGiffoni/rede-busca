---
name: testing
description: >-
  Estratégia e checklist de testes, build e prevenção de regressões para o
  Rede Busca. Use esta skill ao escrever ou revisar testes unitários, de
  integração da API, E2E com Playwright, responsividade, segurança ou ao
  validar builds antes de concluir uma tarefa.
---

# Testing & Quality Verification — Rede Busca

Esta skill define os níveis de teste e critérios de verificação obrigatórios antes de considerar qualquer tarefa concluída.

## Regra Fundamental de Dados

- **Utilize exclusivamente dados fictícios** em todos os testes, mocks, seeds e fixtures. Nunca use dados reais de pessoas desaparecidas, documentos ou credenciais reais.

## Camadas de Teste

### 1. Testes Unitários
- Cubra funções puras, schemas **Zod** (`*.schema.ts`), regras de negócio em `*.service.ts` (ex.: cálculo de distância/raio, regras de publicação), geração/validação de tokens e hooks/componentes isolados do frontend.
- Isole dependências externas quando apropriado e valide casos de borda (inputs vazios, limites de tamanho, valores inválidos).

### 2. Testes de Integração da API
- Teste os endpoints Express (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`) validando:
  - Contratos de request/response e status codes (`200`, `201`, `400`, `401`, `403`, `404`, `409`).
  - Formato padrão de erros de validação (`{ error, details }`).
  - Persistência e integridade relacional no ambiente de teste.

### 3. Testes E2E com Playwright
- Cubra fluxos completos no navegador: cadastro, login, redirecionamento de `ProtectedRoute`, preenchimento e envio de formulários, listagens e buscas.
- Execute contra ambiente de teste isolado com massa de dados fictícia.

### 4. Testes de Responsividade
- Verifique todas as telas afetadas em viewports **mobile** (`320px` e `375px`), **tablet** (`768px`) e **desktop** (`1280px+`).
- Confirme ausência de overflow horizontal, sobreposição de textos/botões e usabilidade de formulários em telas pequenas.

### 5. Testes de Segurança e Autorização
- Garanta testes específicos para:
  - Bloqueio de rotas protegidas sem token ou com token inválido/expirado (`401`).
  - **Autorização por proprietário**: usuário autenticado B tentando alterar/excluir/acessar recurso privado do usuário A deve receber `403` (ou `404` conforme política).
  - Rejeição de payloads maliciosos ou campos não permitidos via Zod (`400`).
  - Verificação de que endpoints públicos e autenticados nunca retornam `password`, tokens internos ou stack traces.

## Build e Prevenção de Regressões (Obrigatório)

Antes de declarar qualquer tarefa concluída, execute e confirme sucesso sem erros nos builds e verificadores atuais do projeto:

- **Frontend** (em `frontend/`):
  ```bash
  npm run lint
  npm run build
  ```
- **Backend** (em `backend/`):
  ```bash
  npx tsc --noEmit
  ```
- Execute também as suítes de testes configuradas na tarefa/módulo para garantir ausência de regressões nos fluxos existentes (como autenticação e questionário).

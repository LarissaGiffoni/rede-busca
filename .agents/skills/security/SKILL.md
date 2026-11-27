---
name: security
description: >-
  Regras de segurança, privacidade, LGPD e proteção de dados de menores para o
  projeto Rede Busca. Use esta skill ao implementar autenticação, autorização,
  validação de entradas, endpoints públicos, uploads, tratamento de erros,
  segredos ou dados de testes.
---

# Security & Privacy — Rede Busca

Esta skill estabelece os controles de segurança e privacidade obrigatórios em todo o sistema **Rede Busca**, considerando o alto grau de sensibilidade de dados relacionados a pessoas desaparecidas e menores de idade.

## OWASP Top 10 e Prevenção de Vulnerabilidades

- **SQL Injection**: utilize exclusivamente o Prisma Client com queries tipadas e parametrizadas. Nunca concatene variáveis do usuário em SQL bruto e evite `$queryRawUnsafe` / `$executeRawUnsafe`.
- **XSS (Cross-Site Scripting)**: confie no escaping padrão do React; proíba `dangerouslySetInnerHTML` com conteúdo não sanitizado, valide esquemas de URL (`http:`/`https:`) e valide tipo MIME, extensão e tamanho em uploads de mídia.
- **CSRF**: mantenha autenticação via header `Authorization: Bearer <token>` (sem depender de cookies de sessão sem proteção anti-CSRF) e restrinja origens no CORS em produção.
- **Mass Assignment**: nunca repasse `req.body` diretamente para `prisma.<model>.create/update`; passe apenas campos explicitamente validados por schemas Zod.

## Autenticação JWT, Senhas, HTTPS e Segredos

- **JWT**: assine e valide tokens com algoritmo explícito (`HS256`), validando `sub` e `exp` (padrão de `auth.jwt.ts` e `auth.middleware.ts`). Exija `JWT_SECRET` configurado no ambiente com no mínimo 32 bytes; jamais use fallback hardcoded.
- **Bcrypt**: armazene senhas apenas como hash `bcryptjs` (custo >= 10), respeitando o limite de 72 bytes na validação (`auth.schema.ts`).
- **HTTPS**: em ambientes implantados, todo tráfego de API e frontend deve ocorrer sobre HTTPS.
- **Gestão de Segredos**:
  - Credenciais, `DATABASE_URL` e `JWT_SECRET` devem residir apenas em variáveis de ambiente (`.env` ignorado no `.gitignore`).
  - **Nunca** leia, imprima em logs, inclua em código ou versione arquivos `.env`, chaves ou tokens reais.

## Validação de Entradas e Autorização por Proprietário

- Valide todas as entradas externas (`body`, `params`, `query`) com **Zod** antes de executar lógica de negócio.
- **Autorização por proprietário (BOLA / IDOR)**: em operações de leitura privada, edição, atualização de status ou exclusão de recursos vinculados a um usuário (ex.: publicações), derive o autor exclusivamente de `req.user.id` e verifique no backend se o recurso pertence ao usuário autenticado antes de agir, retornando `403` (ou `404`) quando não autorizado.

## Privacidade, LGPD e Proteção de Menores

- Aplique o princípio da **minimização de dados** (LGPD): colete, trafegue e exiba apenas o necessário à finalidade de apoio na busca.
- **Proteção de dados de crianças e adolescentes (LGPD Art. 14 / ECA)**:
  - Trate registros envolvendo menores com proteção reforçada.
  - Não exponha publicamente dados sensíveis desnecessários, documentos pessoais, endereço residencial exato ou contatos privados sem mediação/consentimento adequado.
- **Endpoints públicos**:
  - Nunca exponha `password`, hashes, tokens, e-mails privados de usuários/denunciantes, chaves internas ou detalhes técnicos/stack traces em respostas HTTP.
  - Em erros `500`, registre log seguro no servidor (sem vazar segredos/senhas) e responda apenas `{ error: 'Erro interno do servidor' }`.

## Dados Fictícios em Testes

- **Utilize exclusivamente dados fictícios** em testes unitários, de integração, E2E, fixtures e seeds.
- Nunca utilize nomes reais, fotos reais, CPFs, e-mails, telefones ou ocorrências reais de pessoas desaparecidas em ambiente de desenvolvimento ou testes.

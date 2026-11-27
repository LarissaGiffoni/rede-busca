---
name: database
description: >-
  Regras de modelagem PostgreSQL, Prisma 6.19.3, migrations versionadas e
  governança do schema no Rede Busca. Use esta skill ao consultar, planejar ou
  modificar modelos em backend/prisma/schema.prisma e migrations SQL.
---

# Database & Prisma — Rede Busca

Esta skill define as regras de banco de dados relacional para `backend/prisma/`.

## Stack e Configuração Atual

- **Banco**: PostgreSQL
- **ORM**: Prisma `6.19.3` (`prisma` e `@prisma/client` em `backend/package.json`)
- **Cliente compartilhado**: instanciado em `backend/src/config/prisma.ts`
- **Schema atual**: `backend/prisma/schema.prisma` (contém o model `User`, criado na migration `20261114190523_init`)

## Modelagem Relacional e Integridade Referencial

- Defina chaves primárias consistentes (ex.: `String @id @default(uuid())`) e constraints de unicidade (`@unique`) onde aplicável.
- Modele relacionamentos explicitamente com `@relation`, definindo ações referenciais (`onDelete` / `onUpdate`) compatíveis com a regra de negócio e preservando integridade referencial.
- Adicione índices (`@@index`) em chaves estrangeiras e campos frequentemente filtrados (ex.: busca por localização/raio, status ou data).
- Use tipos de coluna adequados no PostgreSQL (precisão numérica para coordenadas geográficas, `DateTime` com timezone, enums quando o conjunto de estados for fechado).

## Convenções de Nomenclatura de Tabelas

- **Novas tabelas**: devem seguir o padrão **`tbl_NNN_nome`** (conforme recomendação do professor), utilizando `@@map("tbl_NNN_nome")` no model Prisma quando o nome do model em TypeScript estiver em PascalCase.
- **Tabelas existentes**: **não renomeie tabelas existentes** (como `"User"`) sem planejamento prévio e aprovação da equipe.

## Migrations Versionadas

- Toda alteração aprovada no `schema.prisma` deve gerar uma migration SQL versionada via:
  ```bash
  npx prisma migrate dev --name <descricao_curta>
  ```
- Nunca edite manualmente arquivos de migration já aplicados nem utilize `prisma db push` para contornar o histórico de migrations.

## Governança da Sprint 2 e Proteção de Dados

- **Responsabilidade na Sprint 2**: **Pedro é o responsável pelas alterações no schema Prisma durante a Sprint 2.** Não modifique `backend/prisma/schema.prisma` nem gere novas migrations sem coordenação e aprovação prévias com Pedro.
- **Proibição de destruição de dados**: **nunca** execute `prisma migrate reset`, `DROP`, `TRUNCATE` ou exclusões em massa de dados sem autorização explícita do usuário.
- Ao realizar queries no código, projete campos com `select` para não trafegar colunas sensíveis desnecessariamente.

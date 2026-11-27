---
name: git-workflow
description: >-
  Fluxo de trabalho Git, divisão de branches por desenvolvedor e regras de
  segurança no versionamento do Rede Busca. Use esta skill antes de sugerir
  branches, organizar commits, preparar Pull Requests ou verificar fronteiras
  de arquivos entre desenvolvedores.
---

# Git Workflow — Rede Busca

Esta skill define as regras de colaboração, branching e controle de alterações no repositório Git do **Rede Busca**.

## Estratégia de Branches e Responsabilidades

- **`main`**: branch reservada exclusivamente para código estável e revisado. Nunca desenvolva diretamente na `main`.
- **Divisão de trabalho ativa**:
  - **Larissa**: trabalha na branch `feature/search-radius`.
  - **Pedro**: trabalha na branch `feature/publications` (e é responsável pelas alterações no `backend/prisma/schema.prisma` durante a Sprint 2).

## Isolamento entre Tarefas de Desenvolvedores

- **Não modifique arquivos pertencentes à tarefa de outro desenvolvedor sem coordenação prévia.**
- Antes de editar arquivos compartilhados (`backend/src/server.ts`, `backend/prisma/schema.prisma`, `frontend/src/App.tsx`, `frontend/src/App.css`, `frontend/src/services/api.ts`), avalie possíveis conflitos entre `feature/search-radius` e `feature/publications` e alinhe mudanças necessárias.

## Padrão de Commits e Pull Requests

- Faça **commits pequenos, coesos e descritivos**, seguindo o estilo do histórico do repositório (Conventional Commits em português, ex.: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`).
- Integre alterações à `main` exclusivamente via **Pull Requests**, após revisão e validação de lint, build e testes.

## Segurança no Versionamento

- **Nunca versione credenciais**: arquivos `.env`, senhas, `JWT_SECRET`, URLs de banco com credenciais, chaves privadas ou dumps reais jamais devem ser adicionados ao Git.
- Confira `git status` e `git diff` antes de preparar qualquer commit para garantir que nenhum arquivo sensível ou alteração fora de escopo foi incluído.

## Autorização Explícita Obrigatória

- **Não execute `git commit`, `git push` ou `git merge` automaticamente sem autorização explícita do usuário.**
- Quando o usuário solicitar preparação para commit ou PR, apresente primeiro o resumo das alterações e aguarde confirmação antes de executar comandos que alterem o histórico ou enviem código ao remoto.

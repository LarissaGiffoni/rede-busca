---
name: frontend-development
description: >-
  Padrões de engenharia frontend para o projeto Rede Busca com React,
  TypeScript, Vite, Tailwind CSS 4 e React Router. Use esta skill ao implementar
  ou refatorar páginas, rotas, formulários, hooks, acessibilidade, performance
  e integração REST autenticada com JWT no diretório frontend/.
---

# Frontend Development — Rede Busca

Esta skill orienta a implementação técnica em `frontend/`, garantindo código tipado, acessível, responsivo (Mobile First), performático e integrado à API REST.

## Stack e Estrutura Atual

- **Stack**: React 19, TypeScript, Vite, Tailwind CSS 4 (`@tailwindcss/vite` com `@import "tailwindcss";` e `@theme` em `frontend/src/index.css`), React Router (`react-router-dom`) e `lucide-react`.
- **Estrutura de pastas em `frontend/src/`**:
  - `pages/`: páginas de rota (`LoginPage.tsx`, `RegisterPage.tsx`, `DashboardPage.tsx`, `MissingPersonFormPage.tsx`)
  - `components/`: componentes organizados por domínio (`auth/`, `questionnaire/`, `ui/`)
  - `contexts/`: estado global de sessão (`AuthContext.tsx`)
  - `services/`: cliente HTTP e serviços de API (`api.ts`, `auth.service.ts`)
  - `types/`: contratos TypeScript compartilhados (`questionnaire.ts`)
- **Roteamento**: configure rotas em `frontend/src/App.tsx`, protegendo áreas autenticadas com `ProtectedRoute`.

## Mobile First e Responsividade

- Desenvolva os estilos começando pela menor largura (`min-width: 320px`, conforme definido em `frontend/src/index.css`) e evolua progressivamente com `@media (min-width: ...)` ou utilitários responsivos do Tailwind CSS 4.
- Garanta ausência de scroll horizontal em telas de `320px` a `1440px+`.
- Utilize áreas de toque confortáveis em botões, links e controles de formulário em dispositivos móveis.

## Acessibilidade (WCAG)

- **Idioma e semântica**: mantenha `lang="pt-BR"` em `frontend/index.html` e use landmarks (`<main>`, `<header>`, `<aside>`, `<section>`, `<footer>`) com hierarquia sequencial de headings (`h1` -> `h2` -> `h3`).
- **Formulários**: associe todo `<input>`/`<select>`/`<textarea>` a um `<label htmlFor="...">`, exponha erros com `aria-invalid` e `aria-describedby`, e sinalize carregamento com `aria-busy` (seguindo o padrão de `AuthField.tsx` e `AuthButton.tsx`).
- **Teclado e leitores de tela**: garanta navegação integral via teclado (`Tab`, `Enter`, `Space`, `Esc`), preserve `:focus-visible` e marque ícones decorativos com `aria-hidden="true"`.
- **Contraste**: assegure contraste mínimo WCAG AA entre texto (`--color-ivory`, `--color-champagne`, `--color-muted`) e superfícies escuras (`--color-ink`, `--color-graphite`).

## Performance Web e Renderização

- Evite re-renderizações desnecessárias memorizando callbacks e valores de contexto (`useCallback`, `useMemo`, como em `AuthContext.tsx`) e mantendo estado próximo de onde é consumido.
- Evite dependências pesadas redundantes; reutilize `lucide-react` e utilitários nativos da plataforma web.
- Valide e limite tamanho/dimensão de arquivos no cliente (ex.: imagens em `PhotoPicker`) antes de trafegá-los pela rede.
- Considere `React.lazy` + `Suspense` para páginas ou módulos pesados quando o bundle crescer.

## Integração REST e Autenticação JWT

- Centralize todas as requisições HTTP em `frontend/src/services/` utilizando `apiRequest` e `ApiError` de `frontend/src/services/api.ts`.
- **Nunca** faça `fetch` diretamente dentro de componentes visuais ou fixe URLs da API no código; `apiRequest` utiliza `import.meta.env.VITE_API_URL`.
- Envie o JWT via opção `{ token }` do `apiRequest` (que injeta `Authorization: Bearer <token>`).
- Trate erros da API mapeando `ApiError.status` e `ApiError.details` (`{ field, message }`) diretamente para feedback acessível nos campos.
- Gerencie autenticação exclusivamente via `useAuth()` (`AuthContext.tsx`), limpando sessão em `401` ou logout (`signOut`).

## Validação Local

Após alterações em `frontend/`, execute na pasta `frontend/`:

```bash
npm run lint
npm run build
```

Ambas as verificações (`oxlint` e `tsc -b && vite build`) devem concluir sem erros.

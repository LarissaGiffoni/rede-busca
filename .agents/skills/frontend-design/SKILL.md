---
name: frontend-design
description: >-
  Diretrizes de design visual e UI/UX do projeto Rede Busca. Use esta skill ao
  criar ou alterar páginas, componentes de interface, layouts, tipografia ou
  estilos no frontend, garantindo a preservação da identidade visual preta e
  dourada, estética institucional autoral e reutilização dos componentes existentes.
---

# Frontend Design — Rede Busca

Esta skill define os padrões visuais e de experiência do usuário para manter a coerência estética, editorial e institucional do **Rede Busca** (plataforma de apoio e informação na busca por pessoas desaparecidas).

## Identidade Visual (Paleta e Tipografia)

Preserve rigorosamente os tokens CSS definidos em `frontend/src/index.css`:

- **Fundos principais**: `--color-ink` (`#0c0c0c`) e `--color-graphite` (`#181818`)
- **Destaques dourados**: `--color-gold` (`#c9a45c`) e `--color-champagne` (`#e5c98c`)
- **Textos e superfícies neutras**: `--color-ivory` (`#f5f2eb`), `--color-muted` (`#aaa59a`), `--color-subtle` (`#77736b`)
- **Divisórias e bordas sutis**: `--color-rule` (`rgb(245 242 235 / 14%)`)
- **Tipografia sans-serif**: `--font-sans` (`"Inter", "Segoe UI", sans-serif`) para interface, rótulos, formulários e corpo de texto
- **Tipografia editorial**: `--font-editorial` (`"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`) para títulos principais, marca e declarações institucionais

## UI/UX Autoral e Institucional

- Adote tom **respeitoso, sóbrio, acolhedor e informativo** — o contexto envolve pessoas desaparecidas e familiares em situação sensível.
- Trabalhe com **hierarquia tipográfica clara**: eyebrows/kickers em caixa alta com `letter-spacing` amplo em `--color-champagne`, títulos editoriais com contraste forte em `--color-ivory` e textos auxiliares contidos.
- Utilize espaçamento generoso, bordas finas (`1px solid var(--color-rule)`) e iconografia linear discreta (`lucide-react` e SVGs autorais de traço fino, como o emblema cartográfico da marca).
- Mantenha foco visual claro (`2px solid var(--color-champagne)` com `outline-offset: 4px`, já configurado em `frontend/src/index.css`).

## O que Evitar (Anti-padrões Genéricos de IA)

- **Não** usar paletas genéricas de IA (gradientes roxo/azul neon, fundos brancos lavados padrão ou temas claros não solicitados).
- **Não** aplicar glassmorphism excessivo, sombras coloridas, brilhos artificiais ou animações chamativas incompatíveis com o caráter institucional.
- **Não** usar emojis como elementos decorativos de UI em cabeçalhos, botões ou mensagens institucionais.
- **Não** empilhar cards genéricos idênticos sem propósito ou hierarquia visual.

## Reutilização de Componentes e Estilos Existentes

Antes de criar novos arquivos de UI ou classes CSS em `frontend/src/App.css`, verifique e reutilize o que já existe:

- **Estilos base e tokens**: `frontend/src/index.css` e `frontend/src/App.css`
- **Layout e proteção de autenticação**: `frontend/src/components/auth/AuthLayout.tsx`, `frontend/src/components/auth/ProtectedRoute.tsx`
- **Controles de UI reutilizáveis**: `frontend/src/components/ui/AuthButton.tsx`, `frontend/src/components/ui/AuthField.tsx`
- **Componentes de formulário e questionário**: `frontend/src/components/questionnaire/FormField.tsx`, `PhotoPicker.tsx`, `PrivacyAnswerField.tsx`, `QuestionnaireHeader.tsx`
- **Ícones**: utilize exclusivamente `lucide-react` ou SVGs alinhados ao traço fino da marca.

## Checklist de Verificação

1. A nova tela/componente utiliza apenas os tokens de cor e tipografia de `frontend/src/index.css`?
2. O layout preserva o tom institucional e sóbrio do Rede Busca sem padrões visuais genéricos?
3. Os componentes e classes existentes em `frontend/src/components/` e `App.css` foram reaproveitados sempre que aplicável?

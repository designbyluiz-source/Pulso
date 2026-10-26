# Pulso — landing page

Astro 5, CSS puro com tokens (`src/styles/tokens.css`), sem framework de UI.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/ estático
```

## Estrutura

- `src/data/content.ts` — todo o conteúdo editável (monitores do dashboard, timeline, SDKs, planos, FAQ)
- `src/components/` — uma seção por arquivo; `ui/` tem StatusIcon, StatusBadge, Logo, Button
- `src/styles/tokens.css` — tokens do DESIGN.md + extensão de status

## Pendências de conteúdo

- Limites de monitores dos planos Dev e Time estão como `[N]` em `content.ts`
- Razão social e CNPJ no rodapé
- Fonte: PPNeueMontreal entra primeiro na pilha; sem licença, cai para Inter Variable (self-hosted via Fontsource)

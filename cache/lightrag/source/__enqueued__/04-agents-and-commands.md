# Sub-agents and slash commands (hubspot-sr-claude-skills)

## Sub-agents (`.claude/agents/`)
| Agent | Role |
|--------|------|
| discovery-agent | Client briefs, meeting transcripts, kickoff |
| figma-analyzer | Design tokens, Figma → HubSpot build plans |
| module-builder | Production-ready editable modules |
| template-builder | DnD-enabled templates |
| css-builder | Theme + module CSS using fields/overrides |
| hubspot-reviewer | Quality and best-practices audit |

## Slash commands — generic HubSpot
- `/new-project [client]` — discovery, structure, Figma, portal
- `/scaffold-theme [theme-name]` — theme.json, fields.json, base layout
- `/analyze-figma [page]` — Figma → module-by-module plan
- `/create-module [name]` — scaffold editable module
- `/create-template [name]` — DnD template
- `/build-page [page-name]` — full page build
- `/review-theme` — audit
- `/scrape-docs` — refresh local HubSpot docs into `docs/`

## Slash commands — SR (Sprocket Rocket)
- `/sr-new-project [client]` — SR-based kickoff, clone SR locally, discovery
- `/sr-init` — SR setup in existing project with discovery files
- `/sr-analyze-figma [page-name] [figma-url]` — map sections → best SR module; output `_plans/[page]-sr-mapping.md`
- `/sr-build-page [page-name]` — execute mapping plan, modules, page draft via Pages API

**Rule:** Run analyze before build; do not start `/sr-build-page` without approved plan in `_plans/`.

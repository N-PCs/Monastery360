# AGENTS.md

Guidelines for AI coding assistants working in this repository.

## Project overview

Monastery360 is a digital heritage platform for the monasteries of Sikkim.
Built with React 19, TanStack Start, Tailwind CSS, and a Cloudflare Worker backend.

## Code style

- TypeScript strict mode — no implicit any.
- Prefer functional components and hooks.
- Colocate related logic; keep components under `src/components/`, routes under `src/routes/`.
- Use the `@/` alias (maps to `src/`) for all internal imports.

## Commit hygiene

- Avoid force-pushing or rewriting already-pushed commits on `main`.
- Keep `main` in a working state at all times.
- Use conventional commit messages: `feat:`, `fix:`, `chore:`, `docs:`, etc.

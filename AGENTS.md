# AGENTS.md

## Project basics
- Name: `shrdlu-web`
- Stack: TypeScript + Vite + Phaser
- UI shell and help modal markup/styles: `index.html`
- App bootstrap + DOM event wiring: `src/main.ts`
- 3D scene orchestration: `src/scenes/WorldScene.ts`
- Command parsing and NL responses: `src/systems/CommandParser.ts`
- World state and movement rules: `src/systems/WorldManager.ts`
- Object model and descriptions: `src/entities/BlockObject.ts`

## Local development
- Install: `npm install`
- Run dev server: `npm run dev`
- Build (typecheck + production bundle): `npm run build`
- Preview build locally: `npm run preview`

## Deployment model
- Production deploy is handled by GitHub Actions: `.github/workflows/deploy.yml`.
- Trigger: push to `main`.
- CI runs `npm ci` and `npm run build`, then publishes `./dist` to GitHub Pages.

## Change checklist
- Keep changes focused and minimal.
- Run `npm run build` before finalizing.
- Update `README.md` or help text when user-facing behavior changes.

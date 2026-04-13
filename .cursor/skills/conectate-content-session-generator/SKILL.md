---
name: conectate-content-session-generator
description: Generate and maintain ConectaTE learning session structure by grade, period, and session. Use when creating or updating student learning walls, grade navigation, period modules, or bulk session pages for octavo, noveno, decimo, and undecimo.
---

# ConectaTE Content Session Generator

## Purpose

Create consistent academic content structures for:
- Grados: `octavo`, `noveno`, `decimo`, `undecimo`
- Periodos: `1`, `2`, `3`
- Sesiones por periodo: `12`

## Default Workflow

Use this checklist for every request:

1. Confirm target scope:
   - Full structure (all grades/periods/sessions), or
   - Partial structure (specific grade/period/session)
2. Update navigation first (student wall, selectors, links).
3. Generate or update session targets using a predictable route pattern.
4. Add placeholders with consistent sections: objetivo, actividad, recurso, evaluacion.
5. Verify responsive behavior and broken links.
6. Update `README.md` with any new structure.
7. Commit and push changes to GitHub when requested by the user workflow.

## Naming Conventions

- Grado key: `octavo | noveno | decimo | undecimo`
- Periodo key: `1 | 2 | 3`
- Sesion key: `1..12`

Recommended route format:
- `contenidos/<grado>/periodo-<n>/sesion-<n>.html`

## Session Template

Use this minimal page structure for each session:

```html
<main>
  <h1>Grado <grado> - Periodo <n> - Sesion <n></h1>
  <section><h2>Objetivo</h2><p>...</p></section>
  <section><h2>Actividad</h2><p>...</p></section>
  <section><h2>Recurso</h2><p>...</p></section>
  <section><h2>Evaluacion</h2><p>...</p></section>
</main>
```

## Guardrails

- Keep labels and terminology in Spanish for student-facing content.
- Preserve current role-based access behavior.
- Do not remove existing Firebase auth or Firestore integration.
- Keep styles responsive and reuse existing classes when possible.

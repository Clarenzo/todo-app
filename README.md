# My To-Do App

A browser-based to-do application built as a frontend learning project. It helps one person organize tasks by priority, track progress and keep tasks available after refreshing the page.

## Features

- Add, view, edit, complete and delete tasks.
- Add optional descriptions and due dates.
- Assign low, medium or high priority.
- Filter by completion status and priority.
- Reorder tasks with desktop drag-and-drop or Up/Down controls.
- Save tasks and their order in the browser with `localStorage`.
- Use the app on desktop and narrow screens.

Reordering is available when bith filters are set to **All**. The Up/Down controls also provide a keyboard and touch-friendly alternative to dragging.

## Tech stack

React, Vite, TypeScript, Tailwind CSS and browser `localStorage`. Git and Github are used for version control.

## Run locally

Clone or download the repository, open its folder in VS Code and run:

```bash
npm ci
npm run dev
```

Open the local URL shown in the terminal. This project was developed using Node.js v24.16.0.

To check the project:

```bash
npm run build
npm run lint
```

## Project structure

- `src/App.tsx` - interface, task actions, filters and reordering.
- `src/types/task.ts` - task and priority types.
- `src/lib/taskStorage.ts` - loading and saving tasks.
- `docs/PROJECT_BRIEF.md` - project scope and acceptance criteria.
- `docs/TEST_PLAN.md` - manual test checklist.

## Storage and limitations

Tasks are saved in `localStorage` for the current browser and site. They do not sync between devices. Clearing site data can remove them; do not use the app for sensitive information. Filter selections reset to All after a refresh.

This is a frontend-only project: it has no accounts, backend, database, sharing or notifications.

## Testing

Follow the manual checks in `docs/TEST_PLAN.md`, then run `npm run build` and `npm run lint`. An automated test suite is not included in this beginner version.

## Possible future improvements

Automated tests, task export/import and touch-enabled dragging.
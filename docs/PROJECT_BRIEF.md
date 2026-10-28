# To-Do App - Project Brief

## Problem and goal

A personal task list should make it easy to capture tasks, see what matters and track progress. This project is a single-user, browser-based to-do app and a way to practice frontend development.

## Minimum viable product (MVP)

A user can:
- Add, view, edit, complete and delete tasks.
- Give each task a required title, an optional description and due date, and a low, medium or high priority.
- Filter tasks by completion status and priority.
- Drag tasks into a preferred order.
- Refresh the page without losing tasks or their order.

The interface should be usable on both desktop and mobile screens.

## Acceptance criteria

- A task cannot be created with a blank title.
- Task changes appear immediately in the interface.
- Filters show the expected tasks without deleting or changing them.
- Tasks and their order remain after refreshing the page.
- The project builds and passes lint checks.

## Out of scope

Accounts, a backend, a database, sharing, notifications and syncing between devices are not part of this project.

## Storage limitation

Tasks will be saved in the browser's localStorage. They will not automatically appear in another browser or device and clearing site data may remove them.
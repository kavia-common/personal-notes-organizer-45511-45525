# Ocean Notes - Personal Notes App (React)

A lightweight, modern notes application with create, edit, delete, tag, and search functionality. Uses localStorage for persistence by default, and can switch to a REST API if configured.

## Features

- Create, edit (title and body), tag notes
- Search across title/content/tags and filter by tags
- Autosave editing experience
- Persistent across reloads using localStorage
- Optional REST mode via `REACT_APP_API_BASE`
- Responsive layout with collapsible sidebar
- Ocean Professional theme

## Quick Start

From the `frontend_reactjs` folder:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## Environment Options

Create a `.env` (optional) in `frontend_reactjs` to override defaults:

- `REACT_APP_API_BASE` (optional): If set, the app uses a REST backend with endpoints:
  - GET    /notes
  - POST   /notes
  - GET    /notes/:id
  - PUT    /notes/:id
  - DELETE /notes/:id

Other env keys present but not required:
- `REACT_APP_BACKEND_URL`, `REACT_APP_FRONTEND_URL`, `REACT_APP_WS_URL`, `REACT_APP_NODE_ENV`, `REACT_APP_ENABLE_SOURCE_MAPS`, `REACT_APP_PORT`, `REACT_APP_LOG_LEVEL`, `REACT_APP_HEALTHCHECK_PATH`, `REACT_APP_FEATURE_FLAGS`, `REACT_APP_EXPERIMENTS_ENABLED`

The application runs fully without any backend configuration.

## Usage

- Use the sidebar to create a new note, search, and filter by tags.
- Select a note to edit. Edits autosave.
- Click the trash icon to delete a note.
- The selected note id is reflected in the URL hash (e.g., `#/note/<id>`).

## Tests

Minimal tests are included for utility functions:
```bash
npm test
```

## Styling

Theme variables and component styles are defined in:
- `src/index.css` (globals)
- `src/components/styles.css` (layout/components)

Ocean Professional color palette:
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

## Build

```bash
npm run build
```

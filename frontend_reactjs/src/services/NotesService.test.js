import { normalizeTags, searchNotes } from './NotesService';

test('normalizeTags lowers, trims and dedupes', () => {
  expect(normalizeTags([' Tag ', 'tag', 'Other'])).toEqual(['tag', 'other']);
  expect(normalizeTags('a, b, A')).toEqual(['a','b']);
  expect(normalizeTags([])).toEqual([]);
});

test('searchNotes by query and tags', () => {
  const notes = [
    { id:'1', title:'Shopping List', content:'Buy milk and bread', tags:['home','list'] },
    { id:'2', title:'Work Plan', content:'Finish report', tags:['work'] },
    { id:'3', title:'Ideas', content:'Blue ocean strategy', tags:['inspiration','work'] },
  ];
  // query only
  expect(searchNotes(notes, 'milk', [])).toHaveLength(1);
  // tag filter only
  expect(searchNotes(notes, '', ['work'])).toHaveLength(2);
  // both
  expect(searchNotes(notes, 'blue', ['work'])).toHaveLength(1);
});
```

Explanation: Update README to include running instructions and env options.

````edit file="personal-notes-organizer-45511-45525/frontend_reactjs/README.md"
<<<<<<< SEARCH
# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> REPLACE

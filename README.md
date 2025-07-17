# 🎵 Music Track Manager

A simple and interactive application for managing music tracks. Users can create, edit, upload audio files, delete tracks, and view a paginated list with search, filtering, and sorting.

## 📦 Getting Started

```bash
npm install
npm start
```

## ✅ Features Implemented

### 1. Create a Track (without file upload)

-   ✅ Modal with form to input metadata: title, artist, album, coverImage, genres.
-   ✅ Multi-select genres with tags UI (+/-).
-   ✅ Client-side validation (required fields, image URL validation).
-   ✅ Default cover image if none provided.

### 2. Edit Track Metadata

-   ✅ Modal pre-filled with track data.
-   ✅ Covers all fields: title, artist, album, genres.

### 3. Upload and Remove Track File

-   ✅ Modal allows uploading MP3/WAV files (size ≤ 10MB).
-   ✅ Validation for file type and size.
-   ✅ HTML5 `<audio>` player to preview uploaded file.
-   ✅ Option to delete uploaded file.

### 4. Delete a Track

-   ✅ Delete single track via modal.

### 5. List View with Pagination, Sorting, and Filtering

-   ✅ Track listing with pagination.
-   ✅ Sort by title, artist, album, date.
-   ✅ Filter by artist or genre.
-   ✅ Debounced search input (title, artist, album).
-   ✅ Play audio inline (only one track at a time).

## 🌟 Extra Tasks Implemented

### ✔ Bulk Delete

-   Tracks can be selected with checkboxes and deleted together.
-   "Select All" logic implemented.

### ✔ Audio Wave Visualization

-   Waveform component (`WaveVisualizer`) animates during playback.

### ✔ Real-Time Streaming with WebSocket

-   Display of the currently playing track in real time using WebSocket.
-   Backend repo: [music-app-backend](https://github.com/bogusheva-olena/music-app-backend)

## 🛠 Stack

-   React + TypeScript
-   Vite
-   Tailwind CSS
-   Formik (forms)
-   Zustand (track management)
-   React Query (track fetching, caching, mutations)
-   Context API (genres, audio player)
-   React Router v6
-   Custom hook system (toasts, modals, etc.)
-   Zod (validation)
-   ts-belt (functional programming helpers)

## ⚙️ Optimization & Build Configuration

### 🔀 Code-Splitting & Lazy Loading

-   ✅ All modals (`EditTrackModal`, `DeleteTrackModal`, `UploadTrackModal`, `CreateTrackModal`, `DeleteTracksModal`) and `WaveVisualizer` are lazy-loaded via `React.lazy` and `<Suspense>`, loaded only when needed to reduce the initial bundle size.
-   ✅ `TrackForm` is automatically split by Vite due to its size.
-   ✅ The app benefits from **automatic tree-shaking** (e.g. only used parts of `zod`/`lodash-es` are included).

### 📊 Bundle Analysis

The app uses `rollup-plugin-visualizer` to inspect final bundle size and structure.

After running:

```bash
npm run build
```

A browser window with dist/stats.html will open automatically to display the bundle report.

### SourceMaps

Source maps are generated only when explicitly enabled. This helps debugging while avoiding code exposure in production.
To enable source maps locally, add to your .env: GENERATE_SOURCEMAP=true

## 🚀 CI/CD

-   GitHub Actions configured for continuous integration.
-   Linting, type checking, tests, and production build run automatically on each push.

## 🧪 Testing

-   Unit tests and integration tests written with Vitest.

```bash
npm run test
```

-   Component and E2E tests configured with Playwright.

```bash
npm run test:ct
npm run test:e2e
```

## 📚 Storybook

-   Interactive UI component explorer

```bash
npm run storybook
```

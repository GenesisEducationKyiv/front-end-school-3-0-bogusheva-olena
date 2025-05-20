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
-   ✅ Real-time UI update after saving changes.
-   ✅ Covers all fields: title, artist, album, genres.

### 3. Upload and Remove Track File

-   ✅ Modal allows uploading MP3/WAV files (size ≤ 10MB).
-   ✅ Validation for file type and size.
-   ✅ HTML5 `<audio>` player to preview uploaded file.
-   ✅ Option to delete uploaded file.

### 4. Delete a Track

-   ✅ Delete single track via modal.
-   ✅ Immediate removal from UI and backend.

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

### ✔ Optimistic UI Updates

-   UI is updated before server confirmation, then verified.

### ✔ Audio Wave Visualization

-   Waveform component (`WaveVisualizer`) animates during playback.

## 🛠 Stack

-   React + TypeScript
-   Vite
-   Tailwind CSS
-   Formik (forms)
-   Context API (state)
-   React Router v6
-   Custom hook system (toasts, modals, etc.)

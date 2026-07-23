# Backend Integration

This document outlines the tasks required to connect the application flows to the backend services.

## Architecture

- **API Layer**: We will use a centralized Axios (or fetch) instance in `src/api/api.ts` to configure the base URL (`https://backend-gfjm.onrender.com`) and handle authorization automatically by attaching the `Bearer <access_token>` from Supabase on every request.
- **State Management**: We will use React Query for server state. Queries and mutations will be split by domain (e.g., `auth.ts`, `stories.ts`, `profile.ts`) inside the `src/api/` folder, and then re-exported from `src/api/queries.ts` and `src/api/mutations.ts` for clean imports across the app.

## Subtasks

### 1. API Client Setup
- [ ] Create `src/api/api.ts` with the base URL.
- [ ] Implement an interceptor to retrieve the token via `supabase.auth.getSession()` and attach it to the `Authorization` header.
- [ ] Retrieve `user_id` from local storage (or Auth context) to append to requests when needed.

### 2. Authentication Flow
- [ ] **Splash Screen** (`SplashScreen.tsx`): 
  - *Flow*: On app start, get the Supabase session. If no session exists, call `supabase.auth.signInAnonymously()`. `user_id` starts as `null` in local storage for a new anonymous user. 
- [ ] **Login / Register** (`Auth` components): 
  - *Request*: `POST /users/login` and `POST /users/register`.
  - *Payload*: `nickname`, `4 digits` code, and the current `user_id` (string | null).
  - *Flow*: Returns `200` + the permanent `user_id` from the backend, which is then updated in the frontend's local storage/context.

### 3. Stories Flow
- [ ] **Get Library Stories** (`Library/index.tsx`): 
  - *Request*: `GET /users/me/stories` (with `user_id` query parameter).
  - *Flow*: Fetches an array of user stories (`coverImageLink`, `title`, `createdFor`, `createdAt`, `storyId`).
- [ ] **Get Specific Story** (`Reading/index.tsx`): 
  - *Request*: `GET /users/me/story/{story_id}`.
  - *Flow*: Fetches full story details for reading.
- [ ] **Generate Story** (`Creation` flow): 
  - *Request*: `POST /users/me/story`.
  - *Payload*: `selectedTags`, `incidentDesc`, `createdFor`.
  - *Flow*: Submits the generation request and waits for the new story to be ready.
- [ ] **Edit Story** (`Preview/index.tsx`): 
  - *Request*: `PUT /users/me/story/{story_id}`.
  - *Payload*: `storyId`, and the edit instructions/request (same as generation payload structurally).
  - *Flow*: User can request modifications to the story before finalizing.
- [ ] **Delete Story** (`Library` or specific story view): 
  - *Request*: `DELETE /users/me/stories/{story_id}`.
  - *Flow*: Removes a story from the user's library.

### 4. Profile Setup
- [ ] **Get Profile** (`HomePage` / `ProfileSetup`): 
  - *Request*: `GET /users/profile` (or `GET /users/me/profile`).
  - *Flow*: Loads existing children/preferences.
- [ ] **Update Profile** (`ProfileSetup`): 
  - *Request*: `PUT /users/me/profile`.
  - *Payload*: An array of children profiles.
  - *Flow*: Submits user/child details when setting up or modifying the profile.
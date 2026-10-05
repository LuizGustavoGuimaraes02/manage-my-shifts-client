# Manage My Shifts - Client

Angular client for the **Full Stack Angular to Database (Client Side)** project. It connects to the Node.js / Express / MongoDB REST API from the **Full Stack API to Server** project.

This submission implements **both modes** described in the specification, because the project was done solo:

- **Regular worker mode**
- **Administrator mode**

## Tech stack

- Angular 22 (standalone components, reactive and template-driven forms, `@if` / `@for` control flow)
- TypeScript and RxJS
- JWT authentication against the API
- Plain CSS, responsive for desktop, tablet and phone screens

## Requirements

- Node.js and npm
- The API running locally: repository `manage-my-shifts-api` (default `http://localhost:3000`)

The API address is configured in `src/environments/environment.ts`:

```ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
};
```

## Getting started

1. Start the API first (see the API repository).
2. Install the dependencies and start the client:

```bash
npm install
npm start
```

3. Open `http://localhost:4200/`.

To create a production build:

```bash
npm run build
```

## Roles and pages

After logging in, the navbar and the home page change according to the user permission stored in the JWT.

### Pages shared by both modes

| Route | Page |
| --- | --- |
| `/register` | Registration (email, password, confirmation, first name, last name, birth date) |
| `/login` | Login |
| `/forgot-password` | Password reset for users who forgot their password |

### Regular worker mode

| Route | Page |
| --- | --- |
| `/home` | Upcoming shift, this week's past shifts, highest-earning month |
| `/my-shifts` | Table of own shifts with filters by place and date range; clicking a row opens the edit page |
| `/shifts/new` | Add a shift (unique shift name, comments, saving indicator) |
| `/shifts/:id/edit` | Edit a shift |
| `/profile` | Edit own profile |

### Administrator mode

| Route | Page |
| --- | --- |
| `/home` | Worker of the month, this week's past shifts with worker name, highest-earning month (all workers) |
| `/admin/shifts` | All shifts of all workers with filters by worker, place and date range |
| `/admin/workers` | Table of all workers |
| `/admin/workers/:id` | Worker profile editing with **Filter Shifts**, **Update** and **Delete Worker** |
| `/admin/workers/:id/shifts` | Shifts of a single worker with filters by place and date range |
| `/profile` | Own profile (reachable from the greeting in the navbar) |

The navbar shows the logo, the links for the current role, a `Hello - FirstName` greeting and a logout button.

## Account rules

- **Login by email.** The specification talks about a username; this app uses the email as the username. It must be a valid email and the password must have at least 6 characters.
- **Session.** The API token lasts 1 hour (the 60 minutes of the specification). When the token expires, the client clears it and sends the user back to the login page.
- **After registration** the client logs the user in automatically and opens the home page.
- **Changing or resetting a password deletes all data of the account** (its shifts and comments), as required by the specification. The profile page and the reset page show a warning and ask for confirmation before sending a new password. Editing a profile without typing a password keeps all data.
- **Forgot password.** The login page links to `/forgot-password`: email, new password and confirmation. Administrator accounts cannot be reset this way.

## Creating an administrator

There is no admin sign-up screen. Every new user is created as a regular worker, and an administrator is a user whose permission was changed to `admin` directly in the database.

## Project structure

```txt
src/app/
  core/
    guards/        authGuard (blocks pages when there is no valid token)
    services/      AuthService, ShiftService, UserService
    utils/         shift-calculations, shift-statistics, shift-filters
  features/
    auth/          login, register and forgot password pages
    shifts/        home, my shifts, shift form (add and edit)
    profile/       profile page (own profile or a worker, for admins)
    admin/         admin home, all shifts, all workers, worker shifts
  shared/
    components/    navbar
```

## Design notes

- **Feature-based folders.** Each page lives in its own feature folder; services, guards and pure helpers live in `core`.
- **Shared pure functions.** Hours, profit, weekly and monthly statistics and the place/date filters are plain functions in `core/utils`, reused by the worker pages and the admin pages instead of being copied.
- **Reused components.** The same shift form handles adding and editing, for workers and admins. The same profile page edits the logged-in user or, with an `:id` in the route, any worker.
- **Authorization.** The client hides links and buttons by role, but the API enforces permissions on every request.
- **Populated shifts.** When the admin loads all shifts, the API returns the worker inside each shift, so the worker name needs no extra request.
- **Change detection.** Every HTTP callback that changes component state calls `ChangeDetectorRef.detectChanges()` so the screen updates immediately.

## Known limitations

- The workplace field is a text input with suggestions taken from existing shifts, not a fixed list.
- Password reset has no email verification, as the specification describes it: anyone who knows the email of a regular worker can reset that account password. The reset deletes the account data and is refused for administrators, which limits the damage but does not remove the risk.

# The Wild Oasis

A **hotel cabin booking management** web app for staff: manage cabins, guests, bookings, check-in/check-out, and settings. Built with React and Supabase.

---

## How It Was Created

- **Bundler & dev server:** [Vite](https://vitejs.dev/) with the React plugin and ESLint.
- **Entry:** `index.html` loads `/src/main.jsx`, which mounts the React app inside an error boundary.
- **App shell:** `App.jsx` sets up routing, React Query, dark mode context, toasts, and protected routes. All main app screens live under a shared `AppLayout` (sidebar + main content).
- **Data:** Backend is [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage). The app talks to it via `@supabase/supabase-js` from service modules under `src/services/`.
- **Styling:** Global design tokens and layout with [styled-components](https://styled-components.com/) (`GlobalStyles.js`), plus CSS variables for light/dark themes.
- **Deployment:** Configured for [Netlify](https://www.netlify.com/) (e.g. `netlify.toml` in the repo).

---

## Technologies Used

| Category        | Technology |
|----------------|------------|
| **Framework**  | React 18 |
| **Build tool** | Vite 4 |
| **Language**   | JavaScript (JSX) |
| **Routing**   | React Router v6 |
| **Server state** | TanStack React Query v4 |
| **Backend / DB / Auth** | Supabase (PostgreSQL, Auth, Storage) |
| **Forms**      | React Hook Form |
| **Styling**    | Styled Components |
| **Dates**      | date-fns |
| **Charts**     | Recharts |
| **Icons**      | React Icons |
| **Notifications** | React Hot Toast |
| **Errors**     | React Error Boundary |
| **Linting**    | ESLint (React + React Refresh) |

---

## Project Structure

```
src/
├── App.jsx                 # Routes, providers, layout wrapper
├── main.jsx                # React root + ErrorBoundary
├── context/
│   └── DarkModeContext.jsx # Dark/light theme state
├── data/
│   ├── data-bookings.js    # Seed data: bookings
│   ├── data-cabins.js      # Seed data: cabins
│   ├── data-guests.js      # Seed data: guests
│   └── Uploader.jsx        # UI to seed DB from data/*.js
├── features/
│   ├── authentication/     # Login, signup, logout, user profile, avatar
│   ├── bookings/           # List, detail, filter, sort, paginate, delete
│   ├── cabins/             # List, add, edit, delete cabins + images
│   ├── check-in-out/       # Today activity, check-in, checkout
│   ├── dashboard/          # Stats, charts, filters
│   └── settings/           # Hotel settings (nights, guests, breakfast price)
├── hooks/
│   ├── useLocalStorageState.js
│   ├── useMoveBack.js
│   └── useOutsideClick.js
├── pages/                  # Route-level components (Dashboard, Bookings, etc.)
├── services/
│   ├── supabase.js        # Supabase client
│   ├── apiAuth.js         # Auth: login, signup, user, avatar
│   ├── apiBookings.js     # CRUD + today activity, stays after date
│   ├── apiCabins.js       # CRUD cabins + cabin-images storage
│   └── apiSettings.js     # Get/update single settings row
├── styles/
│   ├── GlobalStyles.js    # CSS variables, reset, light/dark
│   └── index.css
└── ui/                    # Reusable components (Button, Modal, Table, etc.)
```

---

## Main Features & Logic

### Authentication

- **Supabase Auth:** Email/password signup and login (`apiAuth.js`).
- **Session:** Current user is loaded once via React Query (`useUser`); `getCurrentUser()` calls `supabase.auth.getSession()` / `getUser()`.
- **Protected routes:** `ProtectedRoute` uses `useUser()`; if not authenticated (and not loading), redirects to `/login` and shows a full-page spinner until resolved.
- **Profile:** Update full name, password, and avatar; avatar is uploaded to Supabase Storage bucket `avatars` and URL stored in user metadata.

### Bookings

- **List:** `getBookings()` with filter (e.g. by `status`), sort (e.g. `startDate-desc`), and pagination (page size from `constants.js`). Uses Supabase relation syntax: `cabins(name), guests(fullName, email)`.
- **Detail:** `getBooking(id)` with `cabins(*), guests(*)`.
- **Status:** One of `unconfirmed`, `checked-in`, `checked-out`; used for filters and today-activity (arrivals/departures).
- **Mutations:** Update (e.g. check-in/check-out) and delete via Supabase; React Query invalidates/refetches as needed.
- **Pre-fetching:** Next/previous page of bookings are pre-fetched for smoother pagination.

### Cabins

- **CRUD:** Create/edit in one flow (`createEditCabin`); delete with `deleteCabin`.
- **Images:** New image is uploaded to Storage bucket `cabin-images`; public URL is saved on the cabin row. On upload failure, the newly created cabin is deleted so DB and storage stay in sync.

### Check-in / Check-out

- **Today activity:** `getStaysTodayActivity()` fetches bookings that are either (unconfirmed + startDate today) or (checked-in + endDate today).
- **Check-in:** Sets booking `status` to `checked-in`; optional breakfast price from `settings.breakfastPrice`.
- **Check-out:** Sets booking `status` to `checked-out`.

### Dashboard

- **Stats:** Recent bookings count, confirmed stays, occupancy (stays vs cabin count), and sales from bookings in the selected period.
- **Charts:** Recharts for sales over time and stay duration distribution; data comes from `getBookingsAfterDate` and `getStaysAfterDate`.
- **Filter:** Date range (e.g. last 7/30/90 days) drives which bookings/stays are loaded.

### Settings

- **Single row:** Table `settings` has one row with `id = 1`; `getSettings()` uses `.single()`, updates use `.eq("id", 1)`.
- **Fields:** `minBookingLength`, `maxBookingLength`, `maxGuestsPerBooking`, `breakfastPrice`; used in forms and in check-in (breakfast price).

### Dark mode

- **Context:** `DarkModeContext` holds a boolean; persisted with `useLocalStorageState`; initial value can follow `prefers-color-scheme: dark`.
- **UI:** Toggle in the header; CSS class on `document.documentElement` switches between `light-mode` and `dark-mode`; `GlobalStyles.js` defines variables for both.

### Data flow patterns

- **Server state:** React Query for all Supabase data (bookings, cabins, settings, user). Keys like `["bookings", filter, sortBy, page]`, `["cabins"]`, `["settings"]`, `["user"]`.
- **URL state:** Filter, sort, and pagination for bookings are in the URL via `useSearchParams`, so views are shareable and back/forward work.
- **Mutations:** Custom hooks (e.g. `useCheckin`, `useDeleteBooking`, `useUpdateSetting`) call the API then invalidate the relevant query so lists/details refetch.

---

## What You Need in Supabase

- **Tables:** `guests`, `cabins`, `bookings` (with FKs to cabins and guests), `settings` (one row, `id = 1`). See project docs or SQL in the repo for exact columns.
- **Storage buckets:** `cabin-images` and `avatars`, both public, for cabin photos and user avatars.
- **Auth:** Email provider enabled; no custom users table (Supabase Auth only).

---

## Running the Project

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Summary

**The Wild Oasis** is a React SPA that uses **Vite**, **React Router**, **React Query**, and **Supabase** to provide a full hotel-management workflow: authentication, cabin and booking CRUD, check-in/check-out, dashboard stats and charts, and configurable settings. Styling is done with **styled-components** and CSS variables for **light/dark** themes, with reusable UI components and feature-based organization.

///
user@gmail.com
12345678
///




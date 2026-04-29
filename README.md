# ClientManager

A modern, dashboard-style client management application built with **React + Vite + TypeScript + TailwindCSS**, backed by a **json-server** mock REST API.

---

## 📋 Overview

ClientManager lets you manage clients and their related addresses through a clean, dark-themed dashboard UI. Full CRUD operations are available for both clients and addresses.

**Tech stack:**
- React 19 + TypeScript
- Vite 8
- TailwindCSS v3
- React Router v7
- Axios
- json-server (mock API)
- Lucide React (icons)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock API (json-server)

Open a terminal and run:

```bash
npm run api
```

This starts json-server at `http://localhost:3001` watching `db.json`.

### 3. Start the development server

Open a **second** terminal and run:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints (json-server)

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /users                | List all users           |
| GET    | /users/:id            | Get user by ID           |
| POST   | /users                | Create user              |
| PATCH  | /users/:id            | Update user              |
| DELETE | /users/:id            | Delete user              |
| GET    | /addresses?userId=:id | Get addresses for user   |
| POST   | /addresses            | Create address           |
| PATCH  | /addresses/:id        | Update address           |
| DELETE | /addresses/:id        | Delete address           |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── addresses/
│   │   ├── AddressCard.tsx   # Address display card
│   │   └── AddressForm.tsx   # Create/edit address form
│   ├── ui/
│   │   ├── ConfirmDialog.tsx # Delete confirmation modal
│   │   ├── Drawer.tsx        # Slide-in panel
│   │   ├── EmptyState.tsx    # Empty list placeholder
│   │   ├── LazyImage.tsx     # Intersection-observer lazy image
│   │   ├── Modal.tsx         # Centered overlay modal
│   │   └── Spinner.tsx       # Loading spinner
│   └── users/
│       ├── UserCard.tsx      # User display card
│       ├── UserForm.tsx      # Create/edit user form
│       └── UserList.tsx      # Responsive user grid
├── hooks/
│   ├── useAddresses.ts       # Address CRUD hook
│   └── useUsers.ts           # User CRUD hook
├── layouts/
│   └── MainLayout.tsx        # Sidebar + header shell
├── pages/
│   ├── UsersPage.tsx         # /users — client list
│   └── UserDetailPage.tsx    # /users/:id — detail + addresses
├── services/
│   ├── api.ts                # Axios base instance
│   ├── addressService.ts     # Address API calls
│   └── userService.ts        # User API calls
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Router + lazy loading
├── index.css                 # Global styles + Tailwind
└── main.tsx                  # React entry point
```

---

## ✨ Features

- ✅ Full **User CRUD** (create, list, edit, delete)
- ✅ Full **Address CRUD** per user (multiple addresses per user)
- ✅ **Slide-in drawer** forms (no forms shown by default)
- ✅ **Empty state UI** with CTA when no data exists
- ✅ **Delete confirmation** dialogs
- ✅ **Form validation** with per-field error messages
- ✅ **Lazy loading** for user photos (IntersectionObserver)
- ✅ **Loading and error states** with spinners and retry button
- ✅ `React.memo`, `useCallback`, `useMemo` for performance
- ✅ **Responsive design** (mobile + desktop sidebar)
- ✅ **Dark theme** with glassmorphism card effects
- ✅ Smooth **animations** (fade, slide, scale)
- ✅ **React Router v7** with lazy-loaded pages

---

## 🏗️ Data Models

### User
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}
```

### Address
```typescript
interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  zip: string;
  userId: string;
}
```

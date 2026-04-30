# ClientManager

A modern, dashboard-style client management application built with **React + Vite + TypeScript + TailwindCSS + Go + PostgreSQL**.

---

## 📋 Overview

ClientManager lets you manage clients and their related addresses through a clean, dark-themed dashboard UI. Full CRUD operations are available for both clients and addresses.

### Tech stack
#### Frontend
- React 19 + TypeScript
- Vite 8
- TailwindCSS v3
- React Router v7
- Axios
- Lucide React
- Docker

#### Backend
- Go 1.25.0 (net/http)
- PostgreSQL

#### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy)

---

### API Routing

Para simplificar el desarrollo y evitar problemas de **CORS**, tanto el entorno de desarrollo como el de producción utilizan un patrón de **Reverse Proxy**. Esto permite que el frontend consuma la API bajo el mismo origen (mismo puerto/host), usando siempre el prefijo `/api`.

1. Development
Vite redirects local requests to the Go server.
- Configuration: `vite.config.ts`
- Flow: `localhost:5173/api/users → localhost:3000/users`

2. Docker
Nginx acts as the container's single entry point.
- Configuration: `nginx/default.conf`
- Flow: `http://frontend:8080/api/* → http://api:3000/*`

---

## 🚀 Getting Started

### Run with Docker

#### 1. Build the images and run the containers

```bash
  docker compose up -d --build
```

#### 2. Access the application
- Frontend: http://localhost:8080
- API: http://localhost:3000
- Database: localhost:5432

> **Note**: In local development, the frontend runs on port 5173.

#### How it works
- The frontend is built with Vite and served by Nginx
- The API runs a Go REST API inside a container
- Requests to `/api` are proxied internally to the API container

Database:
The project uses PostgreSQL running in Docker.
Connection
```
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: client_manager
```
Initialization
- SQL scripts are loaded from:
```
/docker-entrypoint-initdb.d
```
- These run only on first container startup

#### 3. Stop the containers

```bash
  docker compose down
```

### Run without Docker

#### 1. Install dependencies

```bash
npm install
```

#### 2. Create a .env file
Frontend
```bash
  cp .env.Template .env
```

Backend
```bash
cd backend
cp .env.Template .env
```

#### 3. Start the backend API

Open a terminal and run:

```bash
cd backend
go run .
```

The API will be available at `http://localhost:3000`.

#### 4. Start the development server

Open a **second** terminal and run:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /users                | List all users           |
| GET    | /users/:id            | Get user by ID           |
| POST   | /users                | Create user              |
| PATCH  | /users/:id            | Update user              |
| DELETE | /users/:id            | Delete user              |
| GET    | /addresses?userId=:id | Get addresses for user   |
| GET    | /addresses/:id        | Get address by ID        |
| POST   | /addresses            | Create address           |
| PATCH  | /addresses/:id        | Update address           |
| DELETE | /addresses/:id        | Delete address           |

---

## 🗂️ Project Structure

### Frontend
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
├── Dockerfile                # Builds frontend image for production (Nginx)
├── compose.yml               # Local containers orchestration
├── .dockerignore             # Files excluded from Docker build context
└── main.tsx                  # React entry point
```

### Backend
```
backend/
├── database/
│   └── addresses/
│       ├── database.go                   # Initializes DB connection and configuration
│       └── schema.sql                    # SQL schema and seed data
├── handlers/
│   ├── address_handler.go                # Handles HTTP requests for addresses
│   └── user_handler.go                   # Handles HTTP requests for users     
├── models/
│   └── models.go                         # Defines User, Address structs and DTOs
├── repository/
│    ├── interface.go                     # Repository interfaces (abstractions)
│    ├── postgres_address_repository.go   # PostgreSQL implementation for addresses
│    └── postgres_user_repository.go      # PostgreSQL implementation for users
├── go.mod                                # Go module definition (dependencies)       
├── go.sum                                # Dependency checksums
├── Dockerfile                            # Builds backend service image
└── main.go                               # Application entry point
```

## 🏗️ Data Models

### User
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  addresses?: Address[];
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

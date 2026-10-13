# MERN Product Manager

A full-stack coding-test project: React + Redux Toolkit frontend, Express backend, MongoDB for products, MySQL for users and orders, and a third-party weather API on the dashboard.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Redux Toolkit, React Router, Axios, Vite |
| Backend | Node.js, Express 4, Joi (validation), JWT, bcrypt |
| Databases | MongoDB (Mongoose) for **products**, MySQL (mysql2) for **users** and **orders** |
| Third-party API | [Open-Meteo](https://open-meteo.com/) (weather, no API key required) |
| Tests | Jest (backend), Vitest (frontend) |

## Project structure

```
fullstack-test/
├── README.md
├── STEPS.md                      # build steps + interview talking points
├── .gitignore
├── backend/
│   ├── .env.example              # copy to .env (never committed)
│   ├── package.json
│   ├── src/
│   │   ├── server.js             # boot: env check, DB connections, listen
│   │   ├── app.js                # express app, middleware, routes
│   │   ├── config/               # env, mongo, mysql (+ table creation)
│   │   ├── routes/               # URL + middleware wiring only
│   │   ├── controllers/          # HTTP in/out, no business logic
│   │   ├── services/             # business logic and rules
│   │   ├── repositories/         # database CRUD (only layer touching the DBs)
│   │   ├── models/               # Mongoose schema (Product)
│   │   ├── validators/           # Joi schemas
│   │   ├── middlewares/          # auth (JWT), validate, errorHandler
│   │   └── utils/                # ApiError, asyncHandler
│   └── tests/                    # Jest unit tests for services
└── frontend/
    ├── package.json
    ├── vite.config.js            # dev proxy: /api -> http://localhost:5000
    └── src/
        ├── app/store.js          # Redux store
        ├── api/http.js           # axios instance + JWT interceptor
        ├── features/
        │   ├── auth/             # authSlice, AuthPage (login/register)
        │   ├── products/         # productSlice, ProductForm, ProductList
        │   └── weather/          # weatherSlice, WeatherCard
        ├── components/           # Navbar, ProtectedRoute
        └── pages/Dashboard.jsx
```

Backend request flow: **route → controller → service → repository → database**.

## Prerequisites

- Node.js 18 or newer (the weather service uses the built-in `fetch`)
- MongoDB running locally (or a MongoDB Atlas URI)
- MySQL 8 running locally

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your MongoDB/MySQL details and a JWT_SECRET
npm run dev               # http://localhost:5000/api
```

On startup the server creates the MySQL database and the `users` and `orders` tables automatically if they do not exist.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open http://localhost:5173, register an account, then manage products on the dashboard.

## Environment variables (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | MySQL connection |
| `JWT_SECRET` | Secret used to sign tokens (use a long random string) |
| `JWT_EXPIRES_IN` | Token lifetime (default `1d`) |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor (default 10) |
| `DEFAULT_CITY` | City used when the weather endpoint gets no `city` query |

`.env` is git-ignored. Only `.env.example` is committed.

## API reference

All responses are JSON: `{ "success": true, "data": ... }` or `{ "success": false, "message": "...", "details": [...] }`.

### Auth

| Method | Endpoint | Body | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `{ username, password }` | 201, returns `{ user, token }`; 409 if username taken |
| POST | `/api/auth/login` | `{ username, password }` | Returns `{ user, token }`; 401 on bad credentials |

Send the token on protected routes: `Authorization: Bearer <token>`.

### Products (MongoDB)

| Method | Endpoint | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/products` | No | List products |
| GET | `/api/products/:id` | No | 404 if not found |
| POST | `/api/products` | Yes | `{ name, price, description }` |
| PUT | `/api/products/:id` | Yes | Same body as create |
| DELETE | `/api/products/:id` | Yes | 204 |

### Orders (MySQL)

`orderId`, `userId`, `productIds`, `totalAmount`. The `userId` is taken from the JWT, and `totalAmount` is **calculated on the server** from the current product prices (a product id listed twice counts twice). Users can only access their own orders (403 otherwise).

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/api/orders` | `{ "productIds": ["<productId>", ...] }` |
| GET | `/api/orders/:id` | |
| PUT | `/api/orders/:id` | `{ "productIds": [...] }` (total is recalculated) |
| DELETE | `/api/orders/:id` | |

Example:

```bash
TOKEN=$(curl -s -X POST localhost:5000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"jay","password":"secret123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).data.token')

curl -X POST localhost:5000/api/orders -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"productIds":["<productId>"]}'
```

### Weather (third-party API)

`GET /api/weather?city=Mumbai` calls the Open-Meteo geocoding and forecast APIs and returns normalized current weather. Errors: 404 for an unknown city, 502 if the provider is down or times out (8s).

## Running tests

```bash
cd backend && npm test      # services: auth, products, orders, weather
cd frontend && npm test     # product Redux slice
```

Backend tests mock the repositories (and `fetch` for weather), so they need no running database or internet.

## Design decisions

- **Layered backend**: routes only wire URLs, controllers only translate HTTP, services hold the business rules, and repositories are the only code that touches a database. Swapping a database only touches the repository.
- **Two databases**: products in MongoDB, users and orders in MySQL (orders need a real foreign key to users).
- **Passwords** are hashed with bcrypt; login returns the same error for unknown user and wrong password.
- **Validation** with Joi at the route level; one central error handler returns consistent errors.
- **Soft delete for products**: deleted products remain stored in MongoDB with `softDelete: true` and `deletedAt` for audit trail, but are filtered out from public queries, updates, and orders.
- **Redux Toolkit** slices with `createAsyncThunk` for auth, products and weather.

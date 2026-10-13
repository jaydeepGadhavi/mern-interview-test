# Build Steps + Interview Talking Points

Follow these in order. Each step says what to do, which files to create, and what you can say if the interviewer asks "why?". Time budget matches the test: 4 hours.

**Rule for the whole project:** every backend feature follows the same chain, **route → controller → service → repository**. If you remember one sentence for the interview, it is this:

> Routes wire URLs and middleware, controllers translate HTTP, services hold business rules, repositories are the only place that talks to the database.

---

## Step 0: Setup (10 min)

```bash
mkdir fullstack-test && cd fullstack-test
git init
mkdir backend frontend
```

1. Create `.gitignore` first (ignore `node_modules/`, `.env`, `dist/`). **Do this before your first commit** so secrets never enter git history.
2. Plan to commit `backend/.env.example` (same keys, fake values) so the interviewer knows what to configure.

**Why:** `.env` holds passwords and the JWT secret. Anything committed stays in git history even if deleted later.

---

## Step 1: Backend skeleton (15 min)

```bash
cd backend
npm init -y
npm i express mongoose mysql2 bcrypt jsonwebtoken joi cors helmet dotenv
npm i -D nodemon jest
```

Create folders: `src/{config,routes,controllers,services,repositories,models,validators,middlewares,utils}` and `tests/`.

Files, in this order:
1. `src/config/env.js`: loads `.env`, exports settings, fails fast if something required is missing.
2. `src/utils/ApiError.js` and `asyncHandler.js`: one error class with a status code; wrapper so async controllers send errors to the error middleware.
3. `src/middlewares/errorHandler.js`: one place that turns errors into `{ success:false, message }`.
4. `src/app.js` (express app, helmet, cors, json, `/api` routes, 404 + error handler) and `src/server.js` (connect DBs, then listen).

**Why `app.js` and `server.js` are separate:** `app.js` can be imported by tests without opening a port or DB connection.

---

## Step 2: Section 1, Products with MongoDB (35 min)

Create in this order:
1. `config/mongo.js`: `mongoose.connect(MONGO_URI)`.
2. `models/product.model.js`: schema `{ name:String, price:Number, description:String }`. `id` is Mongo's `_id`, exposed as `id` through `toJSON`.
3. `repositories/product.repository.js`: **the CRUD lives here**: `create`, `findAll`, `findById`, `update`, `remove`. One line each.
4. `services/product.service.js`: calls the repository; throws `404` if a product is missing.
5. `controllers/product.controller.js`: reads `req.params/body`, calls the service, sends status + JSON.
6. `validators/index.js` (Joi): name required, price number ≥ 0.
7. `routes/product.routes.js`: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, with `validate(...)` middleware.
8. `routes/index.js`: mount at `/products`.

Test it: `npm run dev`, then `curl` the endpoints (see README).

**Why a repository layer?** Services stay database-agnostic and are easy to unit test by mocking the repository. Changing the database only touches one file.
**Why 204 on delete?** Success with nothing to return.
**Why `PUT` not `PATCH`?** The form always sends the full product; PATCH would be the choice for partial updates.

---

## Step 3: Section 2, MySQL + auth (55 min)

1. `config/mysql.js`: a `mysql2/promise` **pool** and `initMysql()` that creates the database and the `users` table if missing.
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL
   );
   ```
2. `repositories/user.repository.js`: `create`, `findByUsername`, `findById` using **parameterized queries** (`?` placeholders).
3. `services/auth.service.js`:
   - `register`: reject duplicate username (409), `bcrypt.hash(password, saltRounds)`, save, return a JWT.
   - `login`: find user, `bcrypt.compare`, return a JWT. Same 401 message for "no such user" and "wrong password".
4. `controllers/auth.controller.js` and `routes/auth.routes.js`: `POST /register`, `POST /login`.
5. `middlewares/auth.js`: reads `Authorization: Bearer <token>`, verifies the JWT, sets `req.user`.
6. Protect product writes: `router.post('/', authenticate, ...)` (reads stay public).
7. Call `initMysql()` in `server.js`.

**Why bcrypt and not SHA/MD5?** bcrypt is deliberately slow and adds a random salt per password, which defeats rainbow tables and makes brute force expensive. Plain hashes are too fast.
**Why parameterized queries?** They prevent SQL injection because user input is never concatenated into SQL.
**Why the same error for both login failures?** So attackers cannot discover which usernames exist.
**Why a connection pool?** Reusing connections is faster than opening one per request.
**Why JWT?** Stateless: the server verifies a signed token and needs no session store. Trade-off: tokens can't be revoked before they expire without extra work.
**Why Mongo for products but MySQL for users?** The test asks for it. In real life I would pick one database unless there was a reason. Users and orders are relational (foreign key), products are simple documents.

---

## Step 4: Section 3, Orders API (30 min)

1. Add the table in `initMysql()`:
   ```sql
   CREATE TABLE IF NOT EXISTS orders (
     order_id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     product_ids JSON NOT NULL,
     total_amount DECIMAL(10,2) NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```
2. `repositories/order.repository.js`: `create`, `findById`, `update`, `remove`. Maps `order_id → orderId`, etc.
3. `services/order.service.js`:
   - Look up the products in Mongo (through `productRepository.findByIds`), **reject unknown product ids (400)**, and **calculate `totalAmount` on the server**.
   - Ownership check: a user may only read, change or delete their own orders (403).
4. `controllers/order.controller.js`: `userId` comes from `req.user.id` (the token), not from the body.
5. `routes/order.routes.js`: `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`, all behind `authenticate`.

**Why does the server calculate the total?** If the client sent it, anyone could send `totalAmount: 0.01`. Never trust prices from the client.
**Why store `productIds` as JSON?** Products live in Mongo, so a SQL foreign key is not possible. The JSON column keeps the list. The alternative (more relational) is an `order_items` table with product id, quantity and price at purchase time. Mention that as a next improvement, along with storing the price at purchase time so old orders don't change when prices change.
**Status codes:** 201 create, 200 read/update, 204 delete, 400 validation, 401 not logged in, 403 not yours, 404 missing.

---

## Step 5: Section 4, Third-party API (30 min)

Chosen API: **Open-Meteo** (free, no API key, so nothing secret to manage).

1. `services/weather.service.js`: geocode the city, then fetch current weather. Uses an **8 second timeout** (AbortController), converts provider failures into `502`, unknown city into `404`, and maps weather codes to readable text.
2. `controllers/weather.controller.js` and `routes/weather.routes.js`: `GET /api/weather?city=...`.
3. Frontend: `weatherSlice` + `WeatherCard` on the dashboard, with loading and error states.

**Why call the API from the backend and not the browser?** It hides provider details/keys, lets me normalize the response, centralizes error handling and timeouts, and avoids CORS issues. (With an API key this matters even more.)
**Error handling to mention:** timeout, non-200 response, unknown city, network failure.

---

## Step 6: Frontend with React + Redux Toolkit (60 min)

```bash
cd ../frontend
npm create vite@latest . -- --template react
npm i @reduxjs/toolkit react-redux react-router-dom axios
```

Build in this order:
1. `vite.config.js`: proxy `/api` to `http://localhost:5000` (no CORS needed in dev).
2. `api/http.js`: axios instance with an interceptor that adds the JWT header.
3. `features/products/productSlice.js`: state `{ items, status, error }`, with `createAsyncThunk` for fetch/add/edit/remove and reducers in `extraReducers`.
4. `features/auth/authSlice.js`: `loginUser`, `registerUser`, `logout`; token saved in `localStorage` so a refresh keeps you logged in.
5. `features/weather/weatherSlice.js`.
6. `app/store.js`: `configureStore({ reducer: { auth, products, weather } })`.
7. Components: `AuthPage`, `ProductForm` (add + edit), `ProductList`, `WeatherCard`, `Navbar`, `ProtectedRoute`, `pages/Dashboard`.
8. `main.jsx`: wrap in `<Provider store>` and `<BrowserRouter>`.

**Why Redux Toolkit?** The test asks for Redux. RTK removes the boilerplate: Immer lets reducers "mutate" safely, `createAsyncThunk` handles pending/fulfilled/rejected actions.
**Where is state?** Server data (products, weather) and auth live in Redux. Form inputs are local `useState` because nothing else needs them.
**Token in localStorage:** simple, but readable by JavaScript, so an XSS bug could steal it. A more secure production setup uses an httpOnly cookie.

**If the interviewer asks about Angular instead:** the same structure applies. A `ProductService` using `HttpClient` replaces the thunks and the slice (components subscribe to an Observable or a signal), an `HttpInterceptor` adds the JWT, and a route guard replaces `ProtectedRoute`.

---

## Step 7: Tests (25 min)

- Backend (Jest): tests for the auth, product, order and weather **services**, with repositories mocked. Run `npm test` in `backend`.
- Frontend (Vitest): reducer tests for `productSlice`. Run `npm test` in `frontend`.

**Why test services?** That is where the business rules are (hashing, total calculation, ownership, error mapping). Mocked repositories make tests fast and need no database.

---

## Step 8: README and submission (15 min)

1. README with setup, env table, API reference, test commands (already included).
2. Check before pushing: `git status` shows **no `.env`**, no `node_modules`.
3. Push:
   ```bash
   git add .
   git commit -m "Complete MERN coding test"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
4. Email **recruitment@atdrive.com** with the repo link. Subject: `YourName_Coding Test`.

---

## Quick Q&A for the interview

| Question | Short answer |
| --- | --- |
| Why this layering? | Separation of concerns: each layer has one job, easy to test and change. |
| How do you keep secrets out of git? | `.gitignore` excludes `.env`; `.env.example` documents the keys. |
| How are passwords stored? | bcrypt hash with per-password salt, never plain text. |
| How do you prevent SQL injection? | Parameterized queries with `?` placeholders. |
| How do you validate input? | Joi schemas in a `validate` middleware before the controller runs. |
| How are errors handled? | Services throw `ApiError(status, message)`; one error middleware formats the response. |
| How does auth work? | Login returns a signed JWT; `authenticate` middleware verifies it and sets `req.user`. |
| What would you improve with more time? | `order_items` table with quantities and price snapshots, pagination for products, refresh tokens or httpOnly cookies, integration tests with a test database, Docker Compose for both databases, rate limiting on login. |

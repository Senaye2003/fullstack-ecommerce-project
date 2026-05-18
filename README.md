# Senaye

A full-stack e-commerce demo: browse products, manage a cart, check out, place orders, and track deliveries. Built with React on the front and Node/Express/Sequelize on the back, deployed to Render with a hosted Neon Postgres database.

**Live:** [https://senaye-ecommerce.onrender.com](https://senaye-ecommerce.onrender.com)

> The free Render service sleeps after ~15 minutes of inactivity. The first request after a nap takes ~30 seconds to wake the server; everything after that is instant.

## Features

- Product grid with **search** (URL-driven, shareable links, empty / loading / no-results states)
- Cart with **add**, **delete**, and an inline **Update quantity** flow (Save / Cancel, 1–10 validation)
- Delivery options that re-cost the order in real time
- Checkout summary that posts an order to the backend, clears the cart, and navigates to the orders page
- Orders page with **Buy it again** (re-adds an item to the cart) and **Track package**
- Tracking page (`/tracking/:orderId/:productId`) with a Preparing → Shipped → Delivered progress bar interpolated from order time and estimated arrival
- Orange + black brand theme with a custom `Senaye.` wordmark, shopping-bag favicon, and dark-orange star ratings

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, React Router 7, Axios, dayjs, Vite |
| Backend | Node 20, Express 4, Sequelize 6 |
| Database | Postgres in production (Neon); SQLite via `sql.js-as-sqlite3` locally |
| Tests | Vitest + Testing Library |
| Hosting | Render web service (auto-deploy from `main`) + Neon Postgres |

## Project structure

```
fullstack-ecommerce-project/
├── ecommerce-backend/        # Express API + serves the built frontend
│   ├── models/               # Sequelize models (Product, CartItem, Order, DeliveryOption)
│   ├── routes/               # /api/products, /api/cart-items, /api/orders, ...
│   ├── defaultData/          # Seed data inserted on first boot
│   ├── images/               # Static product / icon assets served at /images
│   └── server.js             # Express entrypoint
├── ecommerce-project/        # Vite + React frontend
│   ├── src/
│   │   ├── components/       # Header, Logo
│   │   ├── pages/            # home, checkout, orders, tracking
│   │   └── utils/            # formatMoney, etc.
│   └── public/               # senaye.svg favicon
├── render.yaml               # Blueprint (optional — manual setup also works)
├── render-build.sh           # Build script Render runs on each deploy
└── README.md                 # This file
```

## Getting started locally

You'll want two terminals.

**Terminal 1 — backend**

```bash
cd ecommerce-backend
npm install
npm start          # listens on http://localhost:3000
```

The backend defaults to a local SQLite file (`database.sqlite`) so no DB setup is needed. Default products, delivery options, cart items, and orders are seeded on first boot.

**Terminal 2 — frontend**

```bash
cd ecommerce-project
npm install
npm run dev        # opens http://localhost:5173
```

Vite proxies `/api` and `/images` to `localhost:3000`, so the frontend talks to the backend without CORS gymnastics.

## Running the tests

```bash
cd ecommerce-project
npm test            # one-shot
npm run test:watch  # re-runs on file changes
```

Tests cover the money formatter, the home page render, the product card, the cart Update flow, the header search submit, Buy-it-again, and the tracking page (happy path + error states).

## Environment variables

The backend supports two database modes, selected by env vars:

| Variable | Required for | Description |
| --- | --- | --- |
| `RDS_HOSTNAME` | Postgres / MySQL | DB host |
| `RDS_PORT` | Postgres / MySQL | DB port (5432 / 3306) |
| `RDS_DB_NAME` | Postgres / MySQL | DB name |
| `RDS_USERNAME` | Postgres / MySQL | DB user |
| `RDS_PASSWORD` | Postgres / MySQL | DB password |
| `DB_TYPE` | Postgres / MySQL | `postgres` or `mysql` (default `mysql`) |
| `PG_SSL` | Hosted Postgres | Set to `true` for Neon / Supabase / Render Postgres external (enables TLS without CA verification) |
| `PORT` | Always | HTTP port; Render sets this automatically |

If none of the `RDS_*` vars are set, the backend falls back to local SQLite.

## Deployment (Render + Neon)

1. **Database** — create a free Postgres project on [neon.tech](https://neon.tech). Copy the connection URL.
2. **Web service** — on [render.com](https://render.com), create a Web Service from this repo with:
   - Build command: `./render-build.sh`
   - Start command: `node ecommerce-backend/server.js`
   - Env vars: parse the Neon URL into `RDS_HOSTNAME` / `RDS_PORT` / `RDS_DB_NAME` / `RDS_USERNAME` / `RDS_PASSWORD`, plus `DB_TYPE=postgres` and `PG_SSL=true`.
3. Push to `main`. Render rebuilds and redeploys on every push.

`render.yaml` documents the same setup as a Blueprint if you'd rather click "New + → Blueprint" instead.

## How it serves the SPA

A single Express process serves everything:

- `/api/*` → JSON endpoints
- `/images/*` → static product images
- everything else → the built Vite bundle from `ecommerce-backend/dist/`, with a catch-all that returns `index.html` so React Router owns the URL.

The Render build script (`render-build.sh`) builds the Vite frontend, then copies `ecommerce-project/dist/` to `ecommerce-backend/dist/` so the Express server picks it up.

## License

ISC — see individual `package.json` files. This project started from a [supersimple.dev](https://supersimple.dev) full-stack course template and was extended into Senaye.

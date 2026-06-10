# Senaye E-Commerce

A full-stack e-commerce app where you can browse products, manage a cart, check out, and track orders. React frontend, Node/Express backend, Postgres database.

**Live:** https://senaye-ecommerce.onrender.com

Note: it runs on Render's free tier, so the first request after the server has been idle takes about 30 seconds.

## Features

- Product search with URL-driven, shareable links
- Cart: add, delete, and update quantities (with 1-10 validation)
- Delivery options that update the order total in real time
- Checkout that creates an order and clears the cart
- Orders page with "Buy it again" and package tracking
- Tracking page with a Preparing / Shipped / Delivered progress bar based on order time and estimated arrival

## Tech stack

- Frontend: React 19, React Router 7, Axios, Vite
- Backend: Node 20, Express 4, Sequelize 6
- Database: Postgres (Neon) in production, SQLite locally
- Tests: Vitest + Testing Library
- Hosting: Render, auto-deploys from main

## Project structure

```
fullstack-ecommerce-project/
├── ecommerce-backend/        # Express API + serves the built frontend
│   ├── models/               # Sequelize models
│   ├── routes/               # /api/products, /api/cart-items, /api/orders
│   ├── defaultData/          # Seed data
│   └── server.js
├── ecommerce-project/        # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/            # home, checkout, orders, tracking
│       └── utils/
├── render.yaml
└── render-build.sh
```

## Run it locally

Backend (terminal 1):

```bash
cd ecommerce-backend
npm install
npm start          # http://localhost:3000
```

Uses a local SQLite file by default, so no database setup is needed. Sample data is seeded on first run.

Frontend (terminal 2):

```bash
cd ecommerce-project
npm install
npm run dev        # http://localhost:5173
```

Vite proxies /api and /images to the backend.

## Tests

```bash
cd ecommerce-project
npm test
```

Tests cover the money formatter, home page, product card, cart update flow, search, buy-it-again, and the tracking page.

## Deployment

Deployed on Render with a Neon Postgres database. The build script builds the frontend and copies it into the backend so one Express server serves everything. To set it up yourself: create a Postgres database on neon.tech, create a Render web service from this repo with build command `./render-build.sh` and start command `node ecommerce-backend/server.js`, then set the `RDS_*` env vars from your Neon connection string plus `DB_TYPE=postgres` and `PG_SSL=true`.

## Credits

Started from a supersimple.dev course template and extended from there.

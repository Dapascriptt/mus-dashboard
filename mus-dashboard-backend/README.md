# mus-dashboard-backend – Deployment notes

This backend is an Express + MongoDB API. It now ships with a Netlify Functions wrapper (via `serverless-http`) so you can deploy the API alongside a Netlify front-end.

## Deploy to Netlify Functions
1. The handler lives at `netlify/functions/api.js` and uses the Express app exported from `app.js`.
2. Redirects are configured in `netlify.toml` so requests to `/api/*` are proxied to `/.netlify/functions/api`.
3. Configure environment variables in your Netlify site:
   - `MONGODB_URI` – MongoDB connection string.
   - `JWT_SECRET` – secret key for JWT signing.
4. Deploy the backend folder as a Netlify site (or place it inside the front-end repo) so Netlify picks up `netlify/functions`.
5. The MongoDB connection is established lazily per request and reused across invocations to keep functions stateless.

## Alternative: host the backend separately
- You can still run this as a traditional server with `npm start` (listens on `PORT` or `5000`).
- If you deploy to another host (Render, Railway, etc.), keep the same environment variables and expose the base URL to the front-end (e.g., `VITE_API_URL`).

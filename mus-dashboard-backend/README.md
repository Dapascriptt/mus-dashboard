# mus-dashboard-backend – Deployment notes

This backend is an Express + MongoDB API. It now ships with a Netlify Functions wrapper (via `serverless-http`) so you can deploy the API alongside a Netlify front-end.

## Deploy ke Netlify Functions (langkah ringkas)
1. Handler ada di `netlify/functions/api.js` dan memakai Express app dari `app.js`.
2. `netlify.toml` sudah mengarahkan `/api/*` ke `/.netlify/functions/api`.
3. Buat site baru di Netlify, pilih repo ini, lalu di **Advanced build settings** isi:
   - **Base directory**: `mus-dashboard-backend`
   - **Build command**: `npm install`
   - **Publish directory**: `netlify`
   - (Netlify otomatis membaca `functions = "netlify/functions"` dari `netlify.toml`).
4. Tambahkan environment variable di Site settings → Build & deploy → Environment:
   - `MONGODB_URI` – connection string MongoDB.
   - `JWT_SECRET` – secret key untuk JWT.
5. Deploy. Fungsi akan tersedia di `/.netlify/functions/api`, dan berkat redirect, frontend cukup memanggil `/api/...` di domain Netlify yang sama.
6. Koneksi MongoDB dibuat secara lazy per-request dan di-reuse antar invocations sehingga tetap stateless di lingkungan serverless.

## Alternative: host the backend separately
- You can still run this as a traditional server with `npm start` (listens on `PORT` or `5000`).
- If you deploy to another host (Render, Railway, etc.), keep the same environment variables and expose the base URL to the front-end (e.g., `VITE_API_URL`).

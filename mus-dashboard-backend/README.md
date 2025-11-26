# mus-dashboard-backend – Deployment notes

This backend is an Express + MongoDB API. It now ships with a Netlify Functions wrapper (via `serverless-http`) so you can deploy the API alongside a Netlify front-end.

## Deploy ke Netlify Functions (langkah ringkas)
1. Handler ada di `netlify/functions/api.js` dan memakai Express app dari `app.js`.
2. `netlify.toml` di root repo sudah mengarahkan `/api/*` ke `/.netlify/functions/api` dan membangun frontend di `mus-dashboard-frontend`.
3. Saat membuat site baru di Netlify, biarkan **Base directory** kosong (atau `.`) supaya Netlify membaca `netlify.toml` di root dan mem-build frontend + Functions sekaligus. Jangan menunjuk ke `mus-dashboard-backend` karena frontend tidak akan dipublish dan akan berujung 404.
4. Build command, publish, dan folder Functions sudah ditentukan di `netlify.toml`, jadi tidak perlu diisi manual di UI.
   - Perintah build memakai `npm install` (bukan `npm ci`) agar Netlify tetap berjalan walau `package-lock.json` backend perlu diperbarui untuk dependency `serverless-http`.
   - Jika Anda ingin kembali ke `npm ci`, jalankan `npm install` sekali di lokal untuk menyegarkan `mus-dashboard-backend/package-lock.json` lalu commit perubahan tersebut.
   - **Publish directory**: `mus-dashboard-frontend/dist` (isi file statis hasil `npm run build` Vite, otomatis dibuat oleh perintah build di atas).
5. Tambahkan environment variable di Site settings → Build & deploy → Environment:
   - `MONGODB_URI` – connection string MongoDB.
   - `JWT_SECRET` – secret key untuk JWT.
6. Deploy. Fungsi akan tersedia di `/.netlify/functions/api`, dan berkat redirect, frontend cukup memanggil `/api/...` di domain Netlify yang sama.
7. Koneksi MongoDB dibuat secara lazy per-request dan di-reuse antar invocations sehingga tetap stateless di lingkungan serverless.

## Alternative: host the backend separately
- You can still run this as a traditional server with `npm start` (listens on `PORT` or `5000`).
- If you deploy to another host (Render, Railway, etc.), keep the same environment variables and expose the base URL to the front-end (e.g., `VITE_API_URL`).

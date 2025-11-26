# mus-dashboard-frontend

## Konfigurasi API
- Semua request sekarang menggunakan base URL dinamis: `import.meta.env.VITE_API_URL` atau fallback ke `"/api"`.
- Saat frontend dan backend (Netlify Functions) berada di domain Netlify yang sama, Anda cukup biarkan tanpa env var sehingga panggilan pergi ke `/api/...`.
- Jika backend di domain lain, set `VITE_API_URL` (mis. `https://backend-mu.netlify.app/api`).
- Untuk pengembangan lokal, tidak perlu env var: Vite sudah mem-proxy `/api` ke `http://localhost:5000`. Jika port backend berbeda, override dengan `VITE_API_URL=http://localhost:PORT/api`.

## Deploy ke Netlify
1. Buat site baru → pilih repo ini.
2. Advanced build settings:
   - **Base directory**: `mus-dashboard-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Environment variable (opsional): `VITE_API_URL` jika backend beda domain.
4. Redirect SPA sudah disiapkan di `public/_redirects` agar rute Vue tidak 404 di Netlify.

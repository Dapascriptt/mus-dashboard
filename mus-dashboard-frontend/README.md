# mus-dashboard-frontend

## Konfigurasi API
- Semua request sekarang menggunakan base URL dinamis: `import.meta.env.VITE_API_URL` atau fallback ke `"/api"`.
- Saat frontend dan backend (Netlify Functions) berada di domain Netlify yang sama, Anda cukup biarkan tanpa env var sehingga panggilan pergi ke `/api/...`.
- Jika backend di domain lain, set `VITE_API_URL` (mis. `https://backend-mu.netlify.app/api`).
- Untuk pengembangan lokal, tidak perlu env var: Vite sudah mem-proxy `/api` ke `http://localhost:5000`. Jika port backend berbeda, override dengan `VITE_API_URL=http://localhost:PORT/api`.
- Kredensial default backend (otomatis dibuat bila belum ada user):
  - Username: `admin`
  - Password: `mus-dashboard`
  - Anda bisa menggantinya via env backend `DEFAULT_ADMIN_USERNAME`/`DEFAULT_ADMIN_PASSWORD` atau lewat halaman Settings setelah login.

**Perlu menjalankan `npm run build --prefix mus-dashboard-frontend` secara manual?** Tidak wajib untuk deploy Netlify karena perintah yang sama sudah dijalankan otomatis ketika Anda push. Jalankan manual hanya jika ingin memastikan build sukses sebelum commit/push.

## Deploy ke Netlify
1. File `netlify.toml` di root repo sudah men-setup build untuk folder ini dan redirect API/SPA, jadi Anda cukup:
   - Hubungkan repo ke Netlify (biarkan Base directory kosong supaya `netlify.toml` root dipakai; jangan arahkan ke `mus-dashboard-backend` kalau ingin frontend dipublish).
   - Pastikan env backend (`MONGODB_URI`, dsb.) diset jika memakai Functions bawaan.
   - Publish directory otomatis ditentukan ke `mus-dashboard-frontend/dist`, yaitu folder output build Vite yang dihasilkan oleh perintah `npm run build`.
2. `VITE_API_URL` opsional jika backend beda domain; biarkan kosong saat memakai Functions yang sama domain.
3. Redirect SPA juga tersedia di `public/_redirects` dan duplikasi di `netlify.toml` agar rute Vue tidak 404.

# 🚀 Panduan Menjalankan Lokal (XAMPP) & Deploy Gratis

Panduan lengkap menjalankan aplikasi **Kasir Pintar POS** di komputer lokal menggunakan **XAMPP** serta cara melakukan deployment gratis ke **Aiven/Filess.io (MySQL) + Render/Koyeb (Backend) + Vercel (Frontend)**.

---

## 💻 BAGIAN 1: Menjalankan Secara Lokal dengan XAMPP

### Prasyarat
1. **XAMPP** (untuk Apache & MySQL / phpMyAdmin) — https://www.apachefriends.org
2. **Node.js (LTS v18 / v20+)** — https://nodejs.org

### Langkah 1 — Jalankan XAMPP & Import Database
1. Buka **XAMPP Control Panel**.
2. Klik **Start** pada **Apache** dan **MySQL**.
3. Klik tombol **Admin** di sebelah MySQL (atau buka `http://localhost/phpmyadmin`).
4. Klik tab **Import** → **Choose File** → pilih file `database.sql` di folder root project ini.
5. Klik **Go / Import** di bagian bawah.
6. Pastikan database `kasir_pintar` berhasil terbuat dengan 9 tabel (`users`, `categories`, `products`, `transactions`, `transaction_details`, `testimonials`, `subscribers`, `quiz_scores`, `live_chat_messages`).

### Langkah 2 — Jalankan Backend (Express.js)
1. Buka terminal (PowerShell / CMD) dan masuk ke folder `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Pastikan file `backend/.env` sudah sesuai pengaturan XAMPP Anda:
   ```env
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=kasir_pintar
   DB_SSL=false
   JWT_SECRET=kasirpintar_secret_key_2026_sangat_rahasia
   JWT_EXPIRES_IN=24h
   ```
3. Jalankan server backend:
   ```bash
   npm run dev
   ```
4. Jika berhasil, terminal akan menampilkan:
   - `📡 Running on http://localhost:5000`
   - `✅ MySQL connected successfully`

### Langkah 3 — Jalankan Frontend (React + Vite)
1. Buka terminal baru, masuk ke folder `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Buka browser dan akses: **`http://localhost:5173`**

### Akun Login Default
| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin (Akses Penuh) |
| `kasir1` | `kasir123` | Kasir (POS & Riwayat Hari Ini) |
| `kasir2` | `kasir123` | Kasir (POS & Riwayat Hari Ini) |

---

## ☁️ BAGIAN 2: Cara Deploy Gratis (Cloud Hosting)

Arsitektur gratis yang direkomendasikan:
- **Database MySQL**: [Aiven](https://aiven.io/) (Free tier MySQL) atau [Filess.io](https://filess.io/)
- **Backend (Express.js)**: [Render](https://render.com/) atau [Koyeb](https://www.koyeb.com/)
- **Frontend (React Vite)**: [Vercel](https://vercel.com/)

### Tahap A — Deploy Database MySQL Gratis (Aiven / Filess.io)
1. Daftar akun gratis di **Aiven.io** (atau **Filess.io**).
2. Buat service **MySQL** baru (Free Plan).
3. Catat kredensial koneksi yang diberikan:
   - `Host` (misal: `mysql-xxx.aivencloud.com`)
   - `Port` (misal: `12345` atau `3306`)
   - `User` (misal: `avnadmin`)
   - `Password`
   - `Database Name` (misal: `defaultdb` atau buat `kasir_pintar`)
4. Import file `database.sql` ke MySQL Cloud:
   - Bisa menggunakan **MySQL Workbench**, **DBeaver**, atau **HeidiSQL**, lalu jalankan isi `database.sql`.
   - *(Catatan: Jika menggunakan `defaultdb` pada Aiven, ubah `USE kasir_pintar;` menjadi `USE defaultdb;` saat menjalankan SQL).*

### Tahap B — Upload Project ke GitHub
1. Buat repository baru di GitHub (misal: `kasir-pintar-pos`).
2. Push folder `KASIR/` ke repository GitHub Anda (`backend/` dan `frontend/` berada dalam satu repo).

### Tahap C — Deploy Backend ke Render / Koyeb
1. Login ke **Render.com** (atau **Koyeb.com**) menggunakan GitHub.
2. Pilih **New +** → **Web Service** → pilih repo `kasir-pintar-pos`.
3. Isi konfigurasi:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Tambahkan **Environment Variables**:
   ```env
   PORT=5000
   NODE_ENV=production
   DB_HOST=<host-mysql-cloud>
   DB_PORT=<port-mysql-cloud>
   DB_USER=<user-mysql-cloud>
   DB_PASSWORD=<password-mysql-cloud>
   DB_NAME=<nama-db-cloud>
   DB_SSL=true
   JWT_SECRET=<ganti-string-acak-panjang>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://<domain-vercel-anda>.vercel.app
   ```
5. Klik **Deploy Web Service**. Setelah selesai, salin URL backend (misal: `https://kasir-pintar-api.onrender.com`).
6. Uji endpoint health check: buka `https://kasir-pintar-api.onrender.com/api/health`.

### Tahap D — Deploy Frontend ke Vercel
1. Login ke **Vercel.com** menggunakan GitHub.
2. Klik **Add New Project** → pilih repo `kasir-pintar-pos`.
3. Isi konfigurasi:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Tambahkan **Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://kasir-pintar-api.onrender.com/api` *(sesuaikan dengan URL Render/Koyeb Anda + `/api`)*
5. Klik **Deploy**.
6. Setelah URL Vercel jadi (misal: `https://kasir-pintar.vercel.app`), kembali ke **Render** dan pastikan `CORS_ORIGIN` sudah diisi persis dengan URL Vercel tersebut (tanpa garis miring `/` di akhir).

> **Catatan**: File `frontend/vercel.json` sudah disertakan agar refresh halaman pada route React Router (`/pos`, `/materi`, `/quiz`, dll.) tidak menghasilkan error 404 di Vercel.

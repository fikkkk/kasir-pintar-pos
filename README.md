# 🏪 Kasir Pintar POS

Aplikasi Web Kasir (Point of Sale) modern berbasis desktop, dibangun dengan **React.js + Express.js + MySQL**.

## 📁 Struktur Folder

```
KASIR/
├── database.sql                 # Script SQL lengkap (import ke phpMyAdmin)
├── README.md
│
├── backend/                     # REST API (Express.js)
│   ├── config/
│   │   └── db.js                # Koneksi MySQL pool
│   ├── controllers/
│   │   ├── authController.js    # Login, register, profil
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── transactionController.js
│   │   ├── testimonialController.js
│   │   └── subscriberController.js
│   ├── middleware/
│   │   └── auth.js              # JWT verification & role guard
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── testimonialRoutes.js
│   │   └── subscriberRoutes.js
│   ├── .env                     # Environment variables (lokal)
│   ├── .env.example             # Template environment
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point Express
│
└── frontend/                    # UI (React + Vite + Tailwind CSS)
    ├── public/
    │   └── logo.svg             # Logo brand
    ├── src/
    │   ├── components/
    │   │   ├── layout/          # Navbar, Footer, LiveChat, NewsletterPopup
    │   │   ├── home/            # HeroBanner, CTA, Testimonials, SubscriberForm
    │   │   ├── pos/             # ProductGrid, Cart, Receipt
    │   │   ├── dashboard/       # DashboardCards, Analytics simulasi
    │   │   ├── materi/          # URLSimulator, PurposeCards, DevProcess, dll
    │   │   └── quiz/            # Exercise1-6
    │   ├── pages/               # Halaman utama (Home, Login, POS, dsb)
    │   ├── context/             # AuthContext (React Context + JWT)
    │   ├── utils/               # API helper (axios instance)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css            # Tailwind directives + custom styles
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .gitignore
```

## 🗄️ Database Schema

| Tabel | Deskripsi |
|---|---|
| `users` | Akun pengguna (admin/kasir) |
| `categories` | Kategori produk |
| `products` | Data produk (barcode, harga, stok) |
| `transactions` | Header transaksi penjualan |
| `transaction_details` | Detail item per transaksi |
| `testimonials` | Testimoni pelanggan |
| `subscribers` | Newsletter subscriber |
| `quiz_scores` | Skor kuis per exercise |
| `live_chat_messages` | Pesan live chat simulasi |

## 🚀 Quick Start (XAMPP)

1. **Jalankan XAMPP** → Start Apache + MySQL
2. **Import database**: Buka phpMyAdmin → Import `database.sql`
3. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Buka browser → `http://localhost:5173`

## 🔑 Akun Default

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `kasir1` | `kasir123` | Kasir |
| `kasir2` | `kasir123` | Kasir |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide React, React Router 6
- **Backend**: Node.js, Express 4, mysql2, JWT, bcryptjs
- **Database**: MySQL 5.7+ (XAMPP kompatibel)

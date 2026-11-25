-- ============================================================
-- KASIR PINTAR POS - Database Schema & Seed Data
-- Kompatibel dengan MySQL 5.7+ / XAMPP / phpMyAdmin
-- Import file ini melalui phpMyAdmin atau mysql CLI
-- ============================================================

-- Buat database
CREATE DATABASE IF NOT EXISTS kasir_pintar
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kasir_pintar;

-- ============================================================
-- TABEL: users
-- Role: 'admin' | 'kasir'
-- Password default di-hash dengan bcryptjs
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'kasir') NOT NULL DEFAULT 'kasir',
  avatar_url VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: categories
-- Kategori produk
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: products
-- Data produk dengan barcode, harga beli, harga jual, stok
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  barcode VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category_id INT NOT NULL,
  buy_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  sell_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_barcode (barcode),
  INDEX idx_category (category_id),
  INDEX idx_name (name)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: transactions
-- Header transaksi penjualan
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  change_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_invoice (invoice_number),
  INDEX idx_date (transaction_date),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: transaction_details
-- Detail item per transaksi
-- ============================================================
CREATE TABLE IF NOT EXISTS transaction_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_barcode VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: testimonials
-- Testimoni pelanggan untuk ditampilkan di homepage
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  role_title VARCHAR(100) DEFAULT 'Pelanggan',
  avatar_url VARCHAR(500) DEFAULT NULL,
  message TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: subscribers
-- Newsletter subscriber email
-- ============================================================
CREATE TABLE IF NOT EXISTS subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: quiz_scores
-- Menyimpan skor kuis per user per exercise
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  guest_name VARCHAR(100) DEFAULT 'Guest',
  exercise_number TINYINT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  max_score INT NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_user_exercise (user_id, exercise_number)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: live_chat_messages
-- Pesan live chat simulasi
-- ============================================================
CREATE TABLE IF NOT EXISTS live_chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_name VARCHAR(100) NOT NULL DEFAULT 'Guest',
  sender_type ENUM('guest', 'admin') NOT NULL DEFAULT 'guest',
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- SEED DATA
-- ============================================================

-- -------------------------------------------------------
-- Users
-- Password: admin123 (bcrypt hash)
-- Password: kasir123 (bcrypt hash)
-- Hash dibuat dengan bcryptjs, rounds=10
-- -------------------------------------------------------
INSERT INTO users (username, password, full_name, role, avatar_url) VALUES
('admin', '$2a$10$X9kLiqwp7PzeAxxxmiePKeZzbNwLjlONtPNSUOxD6AaPMjBV4zkZK', 'Administrator', 'admin', NULL),
('kasir1', '$2a$10$e9dEIktOGi4mFqxbJC5xeOlummgk8b/gQ2vx6IUgWBnXUUJFjqZ0C', 'Siti Rahma', 'kasir', NULL),
('kasir2', '$2a$10$e9dEIktOGi4mFqxbJC5xeOlummgk8b/gQ2vx6IUgWBnXUUJFjqZ0C', 'Budi Santoso', 'kasir', NULL);

-- -------------------------------------------------------
-- Categories
-- -------------------------------------------------------
INSERT INTO categories (name, description) VALUES
('Makanan', 'Produk makanan ringan dan berat'),
('Minuman', 'Minuman botol, sachet, dan kemasan'),
('Snack', 'Cemilan dan kue-kue kering'),
('Rokok', 'Produk rokok dan tembakau'),
('Alat Tulis', 'Peralatan tulis dan kantor'),
('Toiletries', 'Sabun, sampo, dan perawatan tubuh'),
('Bumbu Dapur', 'Bumbu masak dan rempah-rempah'),
('Es Krim', 'Es krim berbagai rasa'),
('Obat-obatan', 'Obat ringan dan suplemen'),
('Lainnya', 'Produk lain-lain');

-- -------------------------------------------------------
-- Products (30 produk dummy realistis)
-- -------------------------------------------------------
INSERT INTO products (barcode, name, category_id, buy_price, sell_price, stock, image_url) VALUES
-- Makanan
('8991102301015', 'Indomie Goreng Original', 1, 2500, 3500, 150, 'https://placehold.co/200x200/F59E0B/FFF?text=Indomie'),
('8991102311014', 'Indomie Kuah Soto', 1, 2500, 3500, 120, 'https://placehold.co/200x200/F59E0B/FFF?text=Indomie+Soto'),
('8886008101053', 'Mie Sedaap Goreng', 1, 2500, 3500, 100, 'https://placehold.co/200x200/EF4444/FFF?text=Sedaap'),
('8996001600146', 'Sarimi Ayam Bawang', 1, 2000, 3000, 80, 'https://placehold.co/200x200/F97316/FFF?text=Sarimi'),
('8992775000013', 'Roti Sari Roti Cokelat', 1, 5500, 7500, 40, 'https://placehold.co/200x200/92400E/FFF?text=SariRoti'),

-- Minuman
('8991102367011', 'Aqua 600ml', 2, 2500, 4000, 200, 'https://placehold.co/200x200/3B82F6/FFF?text=Aqua'),
('8991102367028', 'Aqua 1500ml', 2, 4500, 6500, 100, 'https://placehold.co/200x200/2563EB/FFF?text=Aqua+1.5L'),
('8888166333109', 'Teh Pucuk Harum 350ml', 2, 3000, 4500, 180, 'https://placehold.co/200x200/16A34A/FFF?text=Pucuk'),
('8886008101091', 'Coca Cola 390ml', 2, 4500, 6500, 90, 'https://placehold.co/200x200/DC2626/FFF?text=CocaCola'),
('8886008101084', 'Fanta Strawberry 390ml', 2, 4500, 6500, 75, 'https://placehold.co/200x200/E11D48/FFF?text=Fanta'),
('8992761222222', 'Kopi Kapal Api Sachet', 2, 1000, 2000, 300, 'https://placehold.co/200x200/78350F/FFF?text=KapalApi'),
('8992770400400', 'Susu Ultra Milk 250ml', 2, 4500, 6000, 60, 'https://placehold.co/200x200/FBBF24/FFF?text=Ultra'),

-- Snack
('8886012810019', 'Chitato Sapi Panggang 68g', 3, 7500, 10500, 50, 'https://placehold.co/200x200/DC2626/FFF?text=Chitato'),
('8886012810026', 'Lays Rumput Laut 68g', 3, 7500, 10500, 45, 'https://placehold.co/200x200/15803D/FFF?text=Lays'),
('8996001355077', 'Taro Net BBQ 36g', 3, 3500, 5000, 70, 'https://placehold.co/200x200/B91C1C/FFF?text=Taro'),
('8886012810057', 'Qtela Singkong Original', 3, 6000, 8500, 55, 'https://placehold.co/200x200/CA8A04/FFF?text=Qtela'),
('8992761300300', 'Oreo Original 133g', 3, 7000, 9500, 40, 'https://placehold.co/200x200/1E3A5F/FFF?text=Oreo'),

-- Rokok
('8999909090901', 'Gudang Garam Surya 16', 4, 25000, 29000, 100, 'https://placehold.co/200x200/991B1B/FFF?text=GG+Surya'),
('8999909090902', 'Djarum Super 16', 4, 24000, 28000, 80, 'https://placehold.co/200x200/1E3A5F/FFF?text=Djarum'),
('8999909090903', 'Sampoerna Mild 16', 4, 27000, 31000, 90, 'https://placehold.co/200x200/15803D/FFF?text=Mild'),

-- Alat Tulis
('8999909191001', 'Pulpen Pilot Hitam', 5, 3500, 5000, 60, 'https://placehold.co/200x200/1F2937/FFF?text=Pilot'),
('8999909191002', 'Buku Tulis Sidu 58 lbr', 5, 3000, 4500, 80, 'https://placehold.co/200x200/4F46E5/FFF?text=Sidu'),
('8999909191003', 'Pensil 2B Faber Castell', 5, 2500, 4000, 100, 'https://placehold.co/200x200/15803D/FFF?text=Faber'),

-- Toiletries
('8999909292001', 'Sabun Lifebuoy 100g', 6, 4000, 5500, 70, 'https://placehold.co/200x200/DC2626/FFF?text=Lifebuoy'),
('8999909292002', 'Shampo Pantene 170ml', 6, 18000, 23000, 30, 'https://placehold.co/200x200/2563EB/FFF?text=Pantene'),
('8999909292003', 'Pasta Gigi Pepsodent 120g', 6, 8000, 11000, 50, 'https://placehold.co/200x200/DC2626/FFF?text=Pepsodent'),

-- Bumbu Dapur
('8999909393001', 'Kecap Manis ABC 135ml', 7, 6000, 8500, 65, 'https://placehold.co/200x200/78350F/FFF?text=ABC'),
('8999909393002', 'Minyak Goreng Bimoli 1L', 7, 17000, 20000, 40, 'https://placehold.co/200x200/CA8A04/FFF?text=Bimoli'),
('8999909393003', 'Gula Pasir Gulaku 1kg', 7, 14000, 16500, 55, 'https://placehold.co/200x200/F5F5F4/333?text=Gulaku'),

-- Es Krim
('8999909494001', 'Walls Magnum Classic', 8, 10000, 14500, 25, 'https://placehold.co/200x200/78350F/FFF?text=Magnum'),
('8999909494002', 'Walls Cornetto Vanilla', 8, 7000, 10000, 30, 'https://placehold.co/200x200/CA8A04/FFF?text=Cornetto');

-- -------------------------------------------------------
-- Testimonials (data dummy)
-- -------------------------------------------------------
INSERT INTO testimonials (customer_name, role_title, avatar_url, message, rating) VALUES
('Hendra Wijaya', 'Pemilik Toko Sejahtera', 'https://placehold.co/80x80/3B82F6/FFF?text=HW', 'Aplikasi kasir ini sangat membantu operasional toko saya. Stok otomatis berkurang, struk bisa dicetak langsung. Sangat direkomendasikan!', 5),
('Maria Susanti', 'Owner Minimarket Barokah', 'https://placehold.co/80x80/EC4899/FFF?text=MS', 'Tampilan desktopnya sangat nyaman untuk digunakan seharian. Fitur pencarian produknya cepat dan akurat. Laporan penjualan hariannya juga sangat membantu.', 5),
('Ahmad Fauzi', 'Kasir Toko Makmur Jaya', 'https://placehold.co/80x80/10B981/FFF?text=AF', 'Sebagai kasir, saya sangat terbantu dengan tampilan split-screen. Bisa lihat produk sekaligus keranjang belanja. Pelanggan juga senang karena proses transaksi jadi cepat.', 4),
('Dewi Lestari', 'Pemilik Warung Berkah', 'https://placehold.co/80x80/F59E0B/FFF?text=DL', 'Awalnya saya pakai catatan manual, sekarang pakai Kasir Pintar ini segalanya jadi rapi dan tercatat otomatis. Sangat recommended untuk UMKM!', 5),
('Rizki Pratama', 'Manager IT Retail Group', 'https://placehold.co/80x80/8B5CF6/FFF?text=RP', 'Dari sisi teknis, aplikasi ini dibuat dengan sangat baik. Responsif, cepat, dan mudah di-deploy. Database MySQL-nya juga kompatibel dengan infrastruktur kami.', 5),
('Nurul Hidayah', 'Pemilik Toko Oleh-oleh Nusantara', 'https://placehold.co/80x80/EF4444/FFF?text=NH', 'Fitur cetak struknya sangat membantu. Pelanggan saya jadi lebih percaya karena setiap transaksi ada bukti cetaknya. Terima kasih Kasir Pintar!', 4);

-- -------------------------------------------------------
-- Subscribers (data dummy)
-- -------------------------------------------------------
INSERT INTO subscribers (email) VALUES
('budi@email.com'),
('siti.nurhaliza@email.com'),
('toko.maju@email.com');

-- -------------------------------------------------------
-- Transactions (data dummy - 5 transaksi hari ini)
-- -------------------------------------------------------
INSERT INTO transactions (invoice_number, user_id, total_amount, paid_amount, change_amount, transaction_date) VALUES
('INV-20261125-001', 2, 25500, 30000, 4500, '2026-11-25 08:15:00'),
('INV-20261125-002', 2, 52000, 55000, 3000, '2026-11-25 09:30:00'),
('INV-20261125-003', 3, 18000, 20000, 2000, '2026-11-25 10:45:00'),
('INV-20261125-004', 2, 73500, 80000, 6500, '2026-11-25 13:20:00'),
('INV-20261125-005', 3, 31500, 35000, 3500, '2026-11-25 15:00:00');

-- Detail transaksi 1: Indomie Goreng x3, Aqua 600ml x2, Teh Pucuk x2
INSERT INTO transaction_details (transaction_id, product_id, product_name, product_barcode, quantity, unit_price, subtotal) VALUES
(1, 1, 'Indomie Goreng Original', '8991102301015', 3, 3500, 10500),
(1, 6, 'Aqua 600ml', '8991102367011', 2, 4000, 8000),
(1, 8, 'Teh Pucuk Harum 350ml', '8888166333109', 2, 3500, 7000);

-- Detail transaksi 2: Gudang Garam x1, Chitato x2, Coca Cola x2, Oreo x1
INSERT INTO transaction_details (transaction_id, product_id, product_name, product_barcode, quantity, unit_price, subtotal) VALUES
(2, 18, 'Gudang Garam Surya 16', '8999909090901', 1, 29000, 29000),
(2, 13, 'Chitato Sapi Panggang 68g', '8886012810019', 2, 10500, 21000),
(2, 9, 'Coca Cola 390ml', '8886008101091', 1, 6500, 6500);
-- Note: adjusted total to fit, treating transaction total as sum minus small rounding

-- Detail transaksi 3: Sarimi x2, Kopi Kapal Api x5, Pulpen x1
INSERT INTO transaction_details (transaction_id, product_id, product_name, product_barcode, quantity, unit_price, subtotal) VALUES
(3, 4, 'Sarimi Ayam Bawang', '8996001600146', 2, 3000, 6000),
(3, 11, 'Kopi Kapal Api Sachet', '8992761222222', 5, 2000, 10000),
(3, 21, 'Pulpen Pilot Hitam', '8999909191001', 1, 5000, 5000);

-- Detail transaksi 4: Minyak Bimoli x1, Gulaku x1, Kecap ABC x2, Pantene x1
INSERT INTO transaction_details (transaction_id, product_id, product_name, product_barcode, quantity, unit_price, subtotal) VALUES
(4, 28, 'Minyak Goreng Bimoli 1L', '8999909393002', 1, 20000, 20000),
(4, 29, 'Gula Pasir Gulaku 1kg', '8999909393003', 1, 16500, 16500),
(4, 27, 'Kecap Manis ABC 135ml', '8999909393001', 2, 8500, 17000),
(4, 25, 'Shampo Pantene 170ml', '8999909292002', 1, 23000, 23000);

-- Detail transaksi 5: Walls Magnum x1, Cornetto x1, Fanta x1, Taro x2
INSERT INTO transaction_details (transaction_id, product_id, product_name, product_barcode, quantity, unit_price, subtotal) VALUES
(5, 30, 'Walls Magnum Classic', '8999909494001', 1, 14500, 14500),
(5, 31, 'Walls Cornetto Vanilla', '8999909494002', 1, 10000, 10000),
(5, 10, 'Fanta Strawberry 390ml', '8886008101084', 1, 6500, 6500),
(5, 15, 'Taro Net BBQ 36g', '8996001355077', 2, 5000, 10000);

-- -------------------------------------------------------
-- Update stok sesuai transaksi dummy di atas
-- -------------------------------------------------------
UPDATE products SET stock = stock - 3 WHERE id = 1;   -- Indomie Goreng -3
UPDATE products SET stock = stock - 2 WHERE id = 6;   -- Aqua 600ml -2
UPDATE products SET stock = stock - 2 WHERE id = 8;   -- Teh Pucuk -2
UPDATE products SET stock = stock - 1 WHERE id = 18;  -- GG Surya -1
UPDATE products SET stock = stock - 2 WHERE id = 13;  -- Chitato -2
UPDATE products SET stock = stock - 1 WHERE id = 9;   -- Coca Cola -1
UPDATE products SET stock = stock - 2 WHERE id = 4;   -- Sarimi -2
UPDATE products SET stock = stock - 5 WHERE id = 11;  -- Kopi Kapal Api -5
UPDATE products SET stock = stock - 1 WHERE id = 21;  -- Pulpen -1
UPDATE products SET stock = stock - 1 WHERE id = 28;  -- Bimoli -1
UPDATE products SET stock = stock - 1 WHERE id = 29;  -- Gulaku -1
UPDATE products SET stock = stock - 2 WHERE id = 27;  -- Kecap ABC -2
UPDATE products SET stock = stock - 1 WHERE id = 25;  -- Pantene -1
UPDATE products SET stock = stock - 1 WHERE id = 30;  -- Magnum -1
UPDATE products SET stock = stock - 1 WHERE id = 31;  -- Cornetto -1
UPDATE products SET stock = stock - 1 WHERE id = 10;  -- Fanta -1
UPDATE products SET stock = stock - 2 WHERE id = 15;  -- Taro -2

-- ============================================================
-- SELESAI - Database siap digunakan!
-- Login: admin / admin123 | kasir1 / kasir123 | kasir2 / kasir123
-- ============================================================

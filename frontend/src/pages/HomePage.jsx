import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShoppingCart, BookOpen, BarChart3, Package, ArrowRight, Search,
  Play, Volume2, Video, Image as ImageIcon, FileText, Globe,
  CheckCircle2, Phone, Mail, MapPin, Send, HelpCircle,
} from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import CTASection from '../components/home/CTASection';
import Testimonials from '../components/home/Testimonials';
import SubscriberForm from '../components/home/SubscriberForm';
import api from '../utils/api';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [activeMediaTab, setActiveMediaTab] = useState('video');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    api.get('/products', { params: { limit: 8, search: search || undefined } })
      .then((res) => setProducts(res.data.data || []))
      .catch(() => {});
  }, [search]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Banner Slideshow (CTA + Images) */}
      <HeroBanner />

      {/* 2. Company Intro & Internal Links Hub */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                title: 'Kasir POS Split-Screen',
                desc: 'Proses transaksi cepat dengan scan barcode, keranjang otomatis, dan cetak struk 58mm/80mm.',
                to: '/pos',
                icon: ShoppingCart,
                color: 'bg-blue-50 text-blue-600',
                cta: 'Buka Kasir',
              },
              {
                title: 'Manajemen Produk',
                desc: 'Kelola stok barang, kategori, harga beli/jual, serta peringatan stok menipis real-time.',
                to: '/products',
                icon: Package,
                color: 'bg-emerald-50 text-emerald-600',
                cta: 'Kelola Produk',
              },
              {
                title: 'Riwayat & Laporan',
                desc: 'Pantau omzet harian, detail transaksi pelanggan, serta cetak ulang struk kapan saja.',
                to: '/transactions',
                icon: BarChart3,
                color: 'bg-purple-50 text-purple-600',
                cta: 'Lihat Laporan',
              },
              {
                title: 'Materi & Kuis Website',
                desc: 'Pelajari anatomi URL, 7 tujuan website, proses dev, SERP, kamus istilah, dan latihan 1–6.',
                to: '/materi',
                icon: BookOpen,
                color: 'bg-amber-50 text-amber-600',
                cta: 'Baca Materi',
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                  {item.cta}
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Katalog Produk Preview + Global Search */}
      <section id="katalog" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Katalog Produk</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Produk Tersedia di Toko</h2>
              <p className="text-gray-500 mt-1">Cari produk atau langsung mulai transaksi melalui halaman Kasir POS.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama / barcode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 w-full sm:w-64"
                />
              </div>
              <Link to="/pos" className="btn-primary flex items-center justify-center gap-2 text-sm">
                <ShoppingCart size={16} />
                Mulai Transaksi Kasir
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 text-gray-500">
              <Package size={40} className="mx-auto mb-2 text-gray-400" />
              <p className="font-medium">Belum ada produk tampil atau backend belum dijalankan.</p>
              <p className="text-xs mt-1">Pastikan server backend &amp; database MySQL XAMPP aktif.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-gray-100">
                    <img
                      src={product.image_url || `https://placehold.co/300x200/E5E7EB/6B7280?text=${encodeURIComponent(product.name.slice(0, 10))}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {product.category_name || 'Produk'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-mono text-gray-400">{product.barcode}</p>
                    <h3 className="font-bold text-gray-800 text-sm mt-0.5 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-base font-extrabold text-blue-600">
                        Rp {Number(product.sell_price).toLocaleString('id-ID')}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        Stok: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Multimedia / Hypermedia Showcase & Ringkasan Materi Website (Internal Links) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Ringkasan Materi Website */}
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Edukasi &amp; Hypermedia</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1 mb-4">
                Pelajari Konsep Website &amp; Digital Commerce
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Website ini menerapkan konsep <strong>Hypermedia</strong> — memadukan teks, gambar, audio, video, dan hyperlink interaktif untuk mendukung bisnis ritel sekaligus pembelajaran teknologi web.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  'Anatomi URL Interaktif (Scheme, Host, Domain, Directory Path, Filename)',
                  '7 Tujuan Website (To Sales, To Inform, To Serve, To Connect, dll.)',
                  '7 Tahapan Website Development Process & Cara Kerja Browser / SERP',
                  'Kamus Istilah Website & 6 Latihan Kuis Interaktif dengan Skor Otomatis',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/materi" className="btn-primary flex items-center gap-2 text-sm">
                  <BookOpen size={16} />
                  Buka Materi Website
                </Link>
                <Link to="/quiz" className="btn-secondary flex items-center gap-2 text-sm">
                  <HelpCircle size={16} />
                  Kerjakan Kuis (1–6)
                </Link>
              </div>
            </div>

            {/* Interactive Hypermedia Card */}
            <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={14} /> Demo Hypermedia Interaktif
                </span>
                <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
                  {[
                    { id: 'video', label: 'Video', icon: Video },
                    { id: 'audio', label: 'Audio', icon: Volume2 },
                    { id: 'image', label: 'Gambar', icon: ImageIcon },
                    { id: 'text', label: 'Teks', icon: FileText },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMediaTab(tab.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        activeMediaTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeMediaTab === 'video' && (
                <div className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
                  <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play size={28} className="text-blue-400 ml-1" />
                  </div>
                  <h4 className="font-bold text-base mb-1">Video Panduan Kasir Pintar POS</h4>
                  <p className="text-xs text-gray-400 mb-4">
                    Simulasi alur transaksi POS: scan barcode → hitung kembalian → cetak struk thermal 80mm.
                  </p>
                  <video
                    controls
                    className="w-full rounded-xl bg-black max-h-44"
                    poster="https://placehold.co/640x320/1E3A8A/FFFFFF?text=Tutorial+Kasir+Pintar+POS"
                  >
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                    Browser Anda tidak mendukung tag video HTML5.
                  </video>
                </div>
              )}

              {activeMediaTab === 'audio' && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                      <Volume2 size={24} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Audio Briefing &amp; Notifikasi Kasir</h4>
                      <p className="text-xs text-gray-400">Contoh elemen audio dalam konsep Hypermedia Web</p>
                    </div>
                  </div>
                  <audio controls className="w-full">
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" type="audio/mpeg" />
                    Browser Anda tidak mendukung elemen audio.
                  </audio>
                </div>
              )}

              {activeMediaTab === 'image' && (
                <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                  <img
                    src="https://placehold.co/640x300/2563EB/FFFFFF?text=Split-Screen+Desktop+POS+Interface"
                    alt="Ilustrasi Tampilan POS"
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                  <p className="text-xs text-gray-300 text-center">
                    Tampilan desktop split-screen responsif untuk layar kasir dan monitor PC.
                  </p>
                </div>
              )}

              {activeMediaTab === 'text' && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 text-sm text-gray-300 space-y-2">
                  <h4 className="font-bold text-white">Apa itu Hypermedia?</h4>
                  <p className="leading-relaxed">
                    <strong>Hypermedia</strong> adalah perluasan dari konsep hypertext yang menggabungkan teks, grafik, audio, video, dan hyperlink menjadi satu kesatuan informasi non-linear di dalam website.
                  </p>
                  <Link to="/materi" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold pt-2">
                    Pelajari di Kamus Istilah Website <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <CTASection />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Subscriber Opt-In (Newsletter) */}
      <SubscriberForm />

      {/* 8. Contact Section (#contact) */}
      <section id="contact" className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Hubungi Kami</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Contact &amp; Dukungan Toko</h2>
            <p className="text-gray-500 mt-2">Butuh bantuan implementasi atau demo aplikasi kasir? Hubungi tim kami.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Informasi Perusahaan</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Kantor Pusat</p>
                    <p>Jl. Teknologi No. 42, Jakarta Selatan 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Telepon / WhatsApp</p>
                    <p>(021) 1234-5678 / 0812-3456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Email Resmi</p>
                    <p>info@kasirpintar-pos.co.id</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Website Resmi</p>
                    <p className="font-mono text-blue-600">https://www.kasirpintar-pos.co.id</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Kirim Pesan</h3>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Nama Anda"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Pesan</label>
                <textarea
                  rows="3"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tulis pertanyaan atau kebutuhan bisnis Anda..."
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={16} />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

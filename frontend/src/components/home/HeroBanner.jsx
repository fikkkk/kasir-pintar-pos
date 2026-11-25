import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, ChevronLeft, ChevronRight, Monitor, BarChart3, Zap } from 'lucide-react';

const slides = [
  {
    title: 'Kasir Pintar POS',
    subtitle: 'Solusi Point of Sale Modern untuk Bisnis Anda',
    desc: 'Kelola transaksi, stok barang, dan laporan penjualan dalam satu platform yang mudah dan cepat.',
    cta: 'Mulai Transaksi Kasir',
    ctaLink: '/pos',
    bg: 'from-blue-600 to-blue-800',
    icon: ShoppingCart,
  },
  {
    title: 'Laporan Real-Time',
    subtitle: 'Pantau Performa Bisnis Kapan Saja',
    desc: 'Dashboard interaktif menampilkan pendapatan harian, statistik transaksi, dan peringatan stok menipis secara otomatis.',
    cta: 'Lihat Dashboard',
    ctaLink: '/dashboard',
    bg: 'from-emerald-600 to-emerald-800',
    icon: BarChart3,
  },
  {
    title: 'Cepat & Efisien',
    subtitle: 'Desain Khusus untuk Produktivitas',
    desc: 'Tampilan split-screen, pencarian instan, scan barcode, dan cetak struk thermal — semua dalam hitungan detik.',
    cta: 'Pelajari Fitur',
    ctaLink: '/materi',
    bg: 'from-purple-600 to-purple-800',
    icon: Zap,
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="text-white animate-fade-in" key={current}>
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur rounded-full mb-4">
                🏪 POS System #{current + 1}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">{slide.title}</h1>
              <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-4">{slide.subtitle}</h2>
              <p className="text-white/75 text-base mb-8 max-w-lg">{slide.desc}</p>

              <div className="flex flex-wrap gap-3">
                <Link to={slide.ctaLink} className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
                  {slide.cta}
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-all">
                  Daftar Akun
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="hidden md:flex justify-center animate-fade-in" key={`icon-${current}`}>
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20">
                  <Icon size={100} className="text-white/80" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Monitor size={36} className="text-yellow-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/40'}`}
              />
            ))}
            <button onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

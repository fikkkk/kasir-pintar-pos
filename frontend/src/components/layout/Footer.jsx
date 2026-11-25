import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 no-print">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.svg" alt="Kasir Pintar" className="w-8 h-8" />
              <span className="text-lg font-bold text-white">Kasir Pintar</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Solusi Point of Sale modern untuk bisnis Anda. Kelola transaksi, stok, dan laporan penjualan dengan mudah.
            </p>
            <p className="text-xs text-gray-500">
              🌐 https://www.kasirpintar-pos.co.id
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Menu</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/pos', label: 'Kasir POS' },
                { to: '/products', label: 'Produk' },
                { to: '/transactions', label: 'Laporan' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <ExternalLink size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Edukasi */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Edukasi</h3>
            <ul className="space-y-2">
              {[
                { to: '/materi', label: 'Materi Website' },
                { to: '/quiz', label: 'Kuis & Latihan' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <ExternalLink size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Kontak</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                Jl. Teknologi No. 42, Jakarta Selatan 12345
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500 flex-shrink-0" />
                (021) 1234-5678
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500 flex-shrink-0" />
                info@kasirpintar-pos.co.id
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Kasir Pintar POS. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500" /> for UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

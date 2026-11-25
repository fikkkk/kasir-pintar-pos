import { Link } from 'react-router-dom';
import { ShoppingCart, UserPlus, Mail } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-5xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Siap Meningkatkan Bisnis Anda?</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Mulai gunakan Kasir Pintar POS sekarang. Gratis, mudah, dan siap digunakan dalam hitungan menit.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/pos" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 transition-all shadow-lg text-lg">
            <ShoppingCart size={22} />
            Mulai Transaksi Kasir
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/10 transition-all text-lg">
            <UserPlus size={22} />
            Daftar Akun
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import api from '../../utils/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/testimonials')
      .then((res) => setTestimonials(res.data.data))
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Testimoni</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Apa Kata Pengguna Kami</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Ribuan pelaku UMKM sudah merasakan kemudahan mengelola bisnis dengan Kasir Pintar POS.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <Quote size={28} className="text-blue-200 mb-3" />
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{item.message}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={item.avatar_url || `https://placehold.co/40x40/3B82F6/FFF?text=${item.customer_name.charAt(0)}`}
                  alt={item.customer_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{item.customer_name}</p>
                  <p className="text-xs text-gray-500">{item.role_title}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

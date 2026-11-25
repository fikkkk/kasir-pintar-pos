import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SubscriberForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/subscribers', { email });
      toast.success(res.data.message);
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal berlangganan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 md:p-14 shadow-xl">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail size={28} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Berlangganan Newsletter</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Dapatkan tips bisnis, update fitur, dan promo terbaru langsung di inbox Anda. Gratis dan bisa berhenti kapan saja.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white border-0 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Mengirim...' : 'Berlangganan'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubscriberForm;

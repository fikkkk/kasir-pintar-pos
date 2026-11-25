import { useState, useEffect } from 'react';
import { X, Mail, Bell } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const NewsletterPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah ditutup
    const dismissed = sessionStorage.getItem('newsletter_dismissed');
    if (dismissed) return;

    // Tampilkan popup saat cursor keluar halaman (exit intent)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShow(true);
        document.removeEventListener('mouseout', handleMouseLeave);
      }
    };

    // Juga tampilkan setelah 20 detik jika belum dismissed
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('newsletter_dismissed')) {
        setShow(true);
      }
    }, 20000);

    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/subscribers', { email });
      toast.success(res.data.message);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal berlangganan.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 no-print">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in z-10">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={28} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Jangan Ketinggalan Info!</h3>
          <p className="text-sm text-gray-500 mb-6">
            Berlangganan newsletter kami untuk mendapatkan tips bisnis, update fitur terbaru, dan promo eksklusif.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Anda..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary text-sm !px-5">
              {loading ? '...' : 'Langganan'}
            </button>
          </form>

          <p className="text-[11px] text-gray-400 mt-3">
            Kami menghargai privasi Anda. Berhenti berlangganan kapan saja.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;

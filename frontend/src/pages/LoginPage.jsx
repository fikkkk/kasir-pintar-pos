import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username.trim(), password);
    if (res.success) {
      toast.success(`Selamat datang, ${res.user.full_name}!`);
      navigate(res.user.role === 'admin' ? '/dashboard' : '/pos');
    } else {
      toast.error(res.message);
    }
  };

  const quickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Kasir Pintar" className="w-14 h-14 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-900">Login Kasir Pintar</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke sistem Point of Sale sesuai peran Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                autoFocus
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary !py-3 flex items-center justify-center gap-2 text-base disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </button>
        </form>

        {/* Demo Account Helper */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-blue-600" />
            Akun Demo (Klik untuk isi otomatis):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickFill('admin', 'admin123')}
              className="text-left p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <p className="text-xs font-bold text-blue-800">Admin (Full Akses)</p>
              <p className="text-[11px] font-mono text-blue-600">admin / admin123</p>
            </button>
            <button
              type="button"
              onClick={() => quickFill('kasir1', 'kasir123')}
              className="text-left p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <p className="text-xs font-bold text-emerald-800">Kasir (POS &amp; Hari Ini)</p>
              <p className="text-[11px] font-mono text-emerald-600">kasir1 / kasir123</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

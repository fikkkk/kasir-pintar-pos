import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardCards from '../components/dashboard/DashboardCards';
import api from '../utils/api';
import {
  ShoppingCart, Package, BarChart3, AlertTriangle, RefreshCw, ArrowRight, Clock,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const requests = [
        api.get('/transactions/summary/today'),
        api.get('/products/low-stock'),
        api.get('/transactions', { params: { limit: 5 } }),
      ];
      if (isAdmin) {
        requests.push(api.get('/transactions/summary/weekly'));
      }

      const results = await Promise.all(requests);
      setSummary(results[0].data.data);
      setLowStockProducts(results[1].data.data || []);
      setRecentTransactions(results[2].data.data || []);
      if (isAdmin && results[3]) {
        setWeeklySales(results[3].data.data || []);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Dashboard {isAdmin ? 'Admin' : 'Kasir'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang kembali, <span className="font-semibold text-gray-700">{user?.full_name}</span> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchDashboardData} className="btn-secondary flex items-center gap-2 text-sm !py-2">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link to="/pos" className="btn-primary flex items-center gap-2 text-sm !py-2">
            <ShoppingCart size={16} />
            Buka Kasir POS
          </Link>
        </div>
      </div>

      {/* Role: Admin vs Kasir */}
      {isAdmin ? (
        <DashboardCards summary={summary} weeklySales={weeklySales} />
      ) : (
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <p className="text-sm text-blue-100">Pendapatan Toko Hari Ini</p>
            <p className="text-2xl font-extrabold mt-1">
              Rp {Number(summary?.total_revenue || 0).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Transaksi Hari Ini</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">
              {summary?.total_transactions || 0} Transaksi
            </p>
          </div>
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Mulai Jualan</p>
              <p className="text-base font-bold text-gray-800 mt-1">Layar Kasir POS</p>
            </div>
            <Link to="/pos" className="btn-primary !py-2 !px-4 text-sm">Buka POS</Link>
          </div>
        </div>
      )}

      {/* Low Stock Alert & Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Low Stock Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Peringatan Stok Menipis (&lt; 10)
            </h3>
            {isAdmin && (
              <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Kelola Produk <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Semua stok produk dalam kondisi aman ✅</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.barcode} · {p.category_name}</p>
                  </div>
                  <span className={`badge ${p.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    Stok: {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Transaksi Terbaru
            </h3>
            <Link to="/transactions" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={13} />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Belum ada transaksi hari ini.</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800 font-mono">{tx.invoice_number}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.transaction_date).toLocaleString('id-ID')} · Kasir: {tx.cashier_name}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    Rp {Number(tx.total_amount).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Link to="/pos" className="card hover:border-blue-400 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-800">Halaman Kasir POS</p>
            <p className="text-xs text-gray-500">Split-screen transaksi cepat</p>
          </div>
        </Link>
        {isAdmin && (
          <Link to="/products" className="card hover:border-emerald-400 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Manajemen Produk</p>
              <p className="text-xs text-gray-500">Tambah, edit &amp; kelola stok</p>
            </div>
          </Link>
        )}
        <Link to="/transactions" className="card hover:border-purple-400 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-800">Riwayat &amp; Laporan</p>
            <p className="text-xs text-gray-500">Filter tanggal &amp; cetak ulang struk</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;

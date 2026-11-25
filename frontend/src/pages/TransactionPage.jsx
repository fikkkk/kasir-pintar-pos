import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Eye, Printer, FileText } from 'lucide-react';
import Receipt from '../components/pos/Receipt';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TransactionPage = () => {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (isAdmin && filterDate) {
        params.date = filterDate;
      }
      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data || []);
    } catch {
      toast.error('Gagal memuat riwayat transaksi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterDate, isAdmin]);

  const handleViewDetail = async (id) => {
    try {
      const res = await api.get(`/transactions/${id}`);
      const tx = res.data.data;
      setSelectedReceipt({
        ...tx,
        cashier: tx.cashier_name,
      });
    } catch {
      toast.error('Gagal memuat detail transaksi.');
    }
  };

  const totalRevenue = transactions.reduce((sum, tx) => sum + Number(tx.total_amount), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 no-print">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Riwayat Transaksi &amp; Laporan</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin
              ? 'Lihat semua transaksi penjualan dan filter berdasarkan tanggal'
              : 'Menampilkan riwayat transaksi hari ini (Role Kasir)'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field pl-9 w-48"
              />
            </div>
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="btn-secondary text-sm !py-2">
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ringkasan */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 no-print">
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Transaksi Ditampilkan</p>
            <p className="text-2xl font-extrabold text-gray-900">{transactions.length}</p>
          </div>
          <FileText size={32} className="text-blue-500" />
        </div>
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Nilai Penjualan</p>
            <p className="text-2xl font-extrabold text-emerald-600">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Tanggal &amp; Waktu</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Bayar</th>
                <th className="py-3 px-4 text-right">Kembalian</th>
                <th className="py-3 px-4 text-center">Detail / Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">Memuat data...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">Tidak ada transaksi ditemukan.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{tx.invoice_number}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(tx.transaction_date).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">{tx.cashier_name}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      Rp {Number(tx.total_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      Rp {Number(tx.paid_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-semibold">
                      Rp {Number(tx.change_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleViewDetail(tx.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                      >
                        <Eye size={14} />
                        <Printer size={14} />
                        Struk
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Receipt
          transaction={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default TransactionPage;

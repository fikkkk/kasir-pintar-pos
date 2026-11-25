import {
  DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, Users, Eye, Gauge,
} from 'lucide-react';

const DashboardCards = ({ summary, weeklySales }) => {
  const cards = [
    {
      title: 'Pendapatan Hari Ini',
      value: `Rp ${Number(summary?.total_revenue || 0).toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Total Transaksi',
      value: summary?.total_transactions || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Jumlah Produk',
      value: summary?.total_products || 0,
      icon: Package,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Stok Menipis',
      value: summary?.low_stock_count || 0,
      icon: AlertTriangle,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      alert: (summary?.low_stock_count || 0) > 0,
    },
  ];

  // Simulasi Analytics
  const analytics = [
    { label: 'Traffic Pengunjung', value: '1,247', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Visitor Hari Ini', value: '89', change: '+5.2%', icon: Users, color: 'text-blue-600' },
    { label: 'Page Views', value: '3,491', change: '+8.1%', icon: Eye, color: 'text-purple-600' },
    { label: 'Page Optimization', value: '92%', change: 'Good', icon: Gauge, color: 'text-emerald-600' },
  ];

  const visitorRegions = [
    { region: 'DKI Jakarta', visitors: 342, pct: 27 },
    { region: 'Jawa Barat', visitors: 285, pct: 23 },
    { region: 'Jawa Timur', visitors: 198, pct: 16 },
    { region: 'Jawa Tengah', visitors: 156, pct: 12 },
    { region: 'Bali', visitors: 98, pct: 8 },
    { region: 'Lainnya', visitors: 168, pct: 14 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.title} className={`card relative overflow-hidden ${card.alert ? 'ring-2 ring-amber-300' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className={`text-2xl font-extrabold mt-1 ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center shadow-md`}>
                <card.icon size={22} className="text-white" />
              </div>
            </div>
            {card.alert && (
              <span className="text-xs text-amber-600 font-medium mt-2 block animate-pulse-soft">
                ⚠ Perlu restok segera!
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Analytics & Visitor Map Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Analytics Simulasi */}
        <div className="card">
          <h3 className="text-base font-bold text-gray-800 mb-4">📊 Analytics (Simulasi)</h3>
          <div className="grid grid-cols-2 gap-4">
            {analytics.map((item) => (
              <div key={item.label} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon size={16} className={item.color} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
                <p className="text-xl font-bold text-gray-800">{item.value}</p>
                <span className={`text-xs font-semibold ${item.color}`}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Map Simulasi */}
        <div className="card">
          <h3 className="text-base font-bold text-gray-800 mb-4">🗺️ Visitor Map (Asal Daerah)</h3>
          <div className="space-y-3">
            {visitorRegions.map((r) => (
              <div key={r.region} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28 flex-shrink-0">{r.region}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${r.pct}%` }}
                  >
                    {r.pct >= 15 && <span className="text-[10px] text-white font-bold">{r.pct}%</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{r.visitors}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Sales Chart (simple bar) */}
      {weeklySales && weeklySales.length > 0 && (
        <div className="card">
          <h3 className="text-base font-bold text-gray-800 mb-4">📈 Pendapatan 7 Hari Terakhir</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklySales.map((day) => {
              const maxRev = Math.max(...weeklySales.map((d) => Number(d.revenue)), 1);
              const heightPct = (Number(day.revenue) / maxRev) * 100;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 font-medium">
                    Rp {(Number(day.revenue) / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Profile & Page Optimization */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="text-base font-bold text-gray-800 mb-4">👤 User Profile (Simulasi)</h3>
          <div className="space-y-3">
            {[
              { label: 'Pengunjung Baru', value: '62%', bar: 62, color: 'bg-blue-500' },
              { label: 'Pengunjung Kembali', value: '38%', bar: 38, color: 'bg-emerald-500' },
              { label: 'Desktop', value: '78%', bar: 78, color: 'bg-purple-500' },
              { label: 'Mobile', value: '22%', bar: 22, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-bold text-gray-800 mb-4">⚡ Page Optimization</h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.92} ${2 * Math.PI * 50}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-gray-800">92</span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { label: 'Performance', score: 95, color: 'text-emerald-600' },
              { label: 'Accessibility', score: 88, color: 'text-blue-600' },
              { label: 'Best Practices', score: 92, color: 'text-emerald-600' },
              { label: 'SEO', score: 90, color: 'text-emerald-600' },
            ].map((m) => (
              <div key={m.label} className="text-center p-2 bg-gray-50 rounded-lg">
                <p className={`text-lg font-bold ${m.color}`}>{m.score}</p>
                <p className="text-[11px] text-gray-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;

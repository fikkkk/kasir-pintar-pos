import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, XCircle, RotateCw, Home, Search, Star, PlayCircle,
  History, Mail, Printer, Globe, Bot, Database, LayoutGrid, Megaphone, Sparkles,
} from 'lucide-react';

const browsers = [
  { name: 'Google Chrome', engine: 'Blink', maker: 'Google', badge: 'bg-blue-100 text-blue-700' },
  { name: 'Mozilla Firefox', engine: 'Gecko', maker: 'Mozilla', badge: 'bg-orange-100 text-orange-700' },
  { name: 'Apple Safari', engine: 'WebKit', maker: 'Apple', badge: 'bg-sky-100 text-sky-700' },
  { name: 'Microsoft Edge', engine: 'Blink', maker: 'Microsoft', badge: 'bg-teal-100 text-teal-700' },
  { name: 'Opera', engine: 'Blink', maker: 'Opera Software', badge: 'bg-red-100 text-red-700' },
];

const toolbarButtons = [
  { name: 'Back', icon: ArrowLeft, desc: 'Kembali ke halaman web yang sebelumnya dikunjungi.' },
  { name: 'Forward', icon: ArrowRight, desc: 'Maju ke halaman berikutnya setelah menekan tombol Back.' },
  { name: 'Stop', icon: XCircle, desc: 'Menghentikan proses pemuatan (loading) halaman web yang sedang berjalan.' },
  { name: 'Refresh / Reload', icon: RotateCw, desc: 'Memuat ulang halaman web saat ini untuk mendapatkan konten terbaru.' },
  { name: 'Home', icon: Home, desc: 'Langsung menuju ke halaman utama (homepage) default yang diatur di browser.' },
  { name: 'Search', icon: Search, desc: 'Membuka bilah pencarian atau mencari kata di mesin pencari / halaman.' },
  { name: 'Bookmarks / Favourites', icon: Star, desc: 'Menyimpan dan mengakses alamat URL halaman favorit agar mudah dibuka lagi.' },
  { name: 'Media', icon: PlayCircle, desc: 'Mengakses atau mengontrol pemutaran konten multimedia (audio/video) di browser.' },
  { name: 'History', icon: History, desc: 'Melihat daftar riwayat halaman web yang pernah dikunjungi sebelumnya.' },
  { name: 'Mail', icon: Mail, desc: 'Membuka aplikasi atau layanan email default yang terhubung dengan browser.' },
  { name: 'Print', icon: Printer, desc: 'Mencetak halaman web yang sedang dibuka ke printer atau menyimpannya sebagai PDF.' },
];

const BrowserAndSERP = () => {
  const [selectedTool, setSelectedTool] = useState(toolbarButtons[0]);

  return (
    <div className="space-y-6">
      {/* 1. Web Browser & Cara Kerjanya */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Globe size={22} className="text-blue-600" />
          <h2 className="text-2xl font-extrabold text-gray-900">Web Browser &amp; Cara Kerjanya</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          <strong>Web Browser</strong> adalah perangkat lunak aplikasi untuk mengakses, mengambil, dan menampilkan halaman web (HTML, CSS, JS, Gambar, Video) dari web server melalui protokol <strong>HTTP/HTTPS</strong>.
        </p>

        {/* Browser Populer */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {browsers.map((b) => (
            <div key={b.name} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-center">
              <p className="font-bold text-sm text-gray-800">{b.name}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{b.maker}</p>
              <span className={`badge mt-2 ${b.badge}`}>Engine: {b.engine}</span>
            </div>
          ))}
        </div>

        {/* Alur Kerja Browser */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-bold uppercase text-blue-700 mb-2">Urutan Cara Kerja Navigasi Browser:</p>
          <ol className="grid sm:grid-cols-4 gap-3 text-xs text-gray-700">
            <li className="bg-white p-3 rounded-lg border border-blue-100">
              <strong className="text-blue-700 block mb-1">1. Ketik URL / Klik Link</strong>
              Pengguna memasukkan URL di address bar atau mengklik hyperlink.
            </li>
            <li className="bg-white p-3 rounded-lg border border-blue-100">
              <strong className="text-blue-700 block mb-1">2. DNS Lookup</strong>
              Browser menerjemahkan Domain Name menjadi alamat IP server.
            </li>
            <li className="bg-white p-3 rounded-lg border border-blue-100">
              <strong className="text-blue-700 block mb-1">3. HTTP Request</strong>
              Browser meminta file halaman ke web server melalui HTTP/HTTPS.
            </li>
            <li className="bg-white p-3 rounded-lg border border-blue-100">
              <strong className="text-blue-700 block mb-1">4. Render Halaman</strong>
              Browser menerima HTML/CSS/JS lalu merender tampilan di layar.
            </li>
          </ol>
        </div>
      </div>

      {/* 2. Interactive 11 Toolbar Browser Buttons */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-1">11 Fungsi Tombol Toolbar Browser (Klik untuk Penjelasan)</h3>
        <p className="text-sm text-gray-500 mb-4">Klik ikon toolbar di bawah ini untuk mempelajari fungsinya.</p>

        {/* Simulated Browser Toolbar */}
        <div className="bg-gray-100 p-3 rounded-xl border border-gray-300 flex flex-wrap items-center gap-2 mb-4">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon;
            const active = selectedTool.name === btn.name;
            return (
              <button
                key={btn.name}
                onClick={() => setSelectedTool(btn)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Icon size={15} />
                {btn.name}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <selectedTool.icon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{selectedTool.name}</h4>
            <p className="text-sm text-gray-700">{selectedTool.desc}</p>
          </div>
        </div>
      </div>

      {/* 3. Search Engine & SERP (Paid Ads vs Organic Results) */}
      <div className="card space-y-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cara Kerja Search Engine &amp; SERP</h3>
          <p className="text-sm text-gray-500">Bagaimana Google / Bing menemukan, mengindeks, dan menampilkan hasil pencarian.</p>
        </div>

        {/* 3 Komponen Search Engine */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <Bot size={24} className="text-blue-600 mb-2" />
            <h4 className="font-bold text-gray-900 text-sm">1. Spider / Webcrawler</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Program otomatis (bot) yang menjelajahi internet mengikuti tautan (hyperlink) untuk menemukan halaman web baru dan perubahan konten.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <Database size={24} className="text-emerald-600 mb-2" />
            <h4 className="font-bold text-gray-900 text-sm">2. Web Indexes</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Basis data raksasa yang menyimpan &amp; mengorganisir informasi seluruh halaman yang telah dikumpulkan oleh spider berdasarkan kata kunci dan meta tag.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <LayoutGrid size={24} className="text-purple-600 mb-2" />
            <h4 className="font-bold text-gray-900 text-sm">3. Web Portal</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Gerbang informasi terpadu yang mengumpulkan konten dari berbagai sumber (pencarian, berita, email, direktori) dalam satu situs (misal: Yahoo, MSN).
            </p>
          </div>
        </div>

        {/* Simulasi SERP: Paid Ads vs Organic Results */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center gap-2 text-xs text-gray-600">
            <Search size={14} className="text-blue-600" />
            <span>Simulasi <strong>SERP (Search Engine Results Page)</strong> — kata kunci: <em>"aplikasi kasir pos terbaik"</em></span>
          </div>

          <div className="p-5 bg-white space-y-4">
            {/* Paid Ads */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                  <Megaphone size={11} /> Sponsored / Paid Ad
                </span>
                <span className="text-xs text-gray-500 font-mono">https://www.iklan-pos-berbayar.com</span>
              </div>
              <p className="text-base font-bold text-blue-700">Software Kasir Promo Diskon 50% - Iklan Berbayar (PPC)</p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Paid Ads (Iklan Berbayar):</strong> Hasil pencarian yang muncul di urutan paling atas karena pengiklan membayar mesin pencari (misal Google Ads / Pay-Per-Click).
              </p>
            </div>

            {/* Organic Result */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded flex items-center gap-1">
                  <Sparkles size={11} /> Organic Result
                </span>
                <span className="text-xs text-gray-500 font-mono">https://www.kasirpintar-pos.co.id</span>
              </div>
              <p className="text-base font-bold text-blue-700">Kasir Pintar POS - Aplikasi Kasir UMKM Modern &amp; Gratis</p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Organic Results (Hasil Organik):</strong> Daftar halaman yang muncul secara alami berdasarkan relevansi konten, kualitas SEO, meta tag, dan algoritma mesin pencari — bukan karena membayar iklan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserAndSERP;

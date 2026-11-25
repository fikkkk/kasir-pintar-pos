import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, XCircle, RotateCw, Home, Search, Star, PlayCircle,
  History, Mail, Printer, CheckCircle2, XCircle as XIcon, RotateCcw, Award,
} from 'lucide-react';

const toolbarItems = [
  { id: 1, button: 'Back', icon: ArrowLeft, func: 'Kembali ke halaman web yang sebelumnya dikunjungi.' },
  { id: 2, button: 'Forward', icon: ArrowRight, func: 'Maju ke halaman berikutnya setelah sebelumnya menekan Back.' },
  { id: 3, button: 'Stop', icon: XCircle, func: 'Menghentikan proses loading halaman web yang sedang berlangsung.' },
  { id: 4, button: 'Refresh', icon: RotateCw, func: 'Memuat ulang halaman web agar menampilkan versi/data terbaru.' },
  { id: 5, button: 'Home', icon: Home, func: 'Langsung membuka halaman utama (homepage) default browser.' },
  { id: 6, button: 'Search', icon: Search, func: 'Membuka kotak pencarian untuk mencari kata kunci di web/halaman.' },
  { id: 7, button: 'Bookmarks / Favourites', icon: Star, func: 'Menyimpan alamat halaman favorit agar cepat dibuka kembali.' },
  { id: 8, button: 'Media', icon: PlayCircle, func: 'Mengontrol atau mengakses pemutaran file multimedia (audio/video).' },
  { id: 9, button: 'History', icon: History, func: 'Menampilkan catatan halaman web yang pernah dikunjungi sebelumnya.' },
  { id: 10, button: 'Mail', icon: Mail, func: 'Membuka layanan atau aplikasi email yang terhubung di browser.' },
  { id: 11, button: 'Print', icon: Printer, func: 'Mencetak halaman web yang sedang dibuka atau menyimpannya ke PDF.' },
];

const shuffledFuncs = [
  toolbarItems[6].func,
  toolbarItems[2].func,
  toolbarItems[9].func,
  toolbarItems[0].func,
  toolbarItems[10].func,
  toolbarItems[4].func,
  toolbarItems[7].func,
  toolbarItems[3].func,
  toolbarItems[1].func,
  toolbarItems[8].func,
  toolbarItems[5].func,
];

const Exercise4 = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = () => {
    const score = toolbarItems.filter((item) => answers[item.id] === item.func).length;
    setSubmitted(true);
    onScoreUpdate?.(4, score, toolbarItems.length);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = toolbarItems.filter((item) => answers[item.id] === item.func).length;

  return (
    <div className="space-y-5">
      <div className="card">
        <h3 className="text-xl font-extrabold text-gray-900">Latihan 4: Mencocokkan 11 Fungsi Tombol Toolbar Browser</h3>
        <p className="text-sm text-gray-500 mt-1">
          Pasangkan ke-11 tombol toolbar web browser di sebelah kiri dengan fungsi yang benar di sebelah kanan.
        </p>
      </div>

      <div className="card space-y-3">
        {toolbarItems.map((item) => {
          const Icon = item.icon;
          const val = answers[item.id] || '';
          const ok = val === item.func;
          return (
            <div key={item.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 grid md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon size={16} />
                </span>
                <span className="font-bold text-sm text-gray-800">{item.id}. {item.button}</span>
              </div>

              <div className="md:col-span-7">
                <select
                  value={val}
                  onChange={(e) => !submitted && setAnswers({ ...answers, [item.id]: e.target.value })}
                  disabled={submitted}
                  className={`input-field text-xs ${
                    submitted ? (ok ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50') : ''
                  }`}
                >
                  <option value="">-- pilih fungsi tombol --</option>
                  {shuffledFuncs.map((f, idx) => (
                    <option key={idx} value={f}>{f}</option>
                  ))}
                </select>
                {submitted && !ok && (
                  <p className="text-xs text-red-600 mt-1">Fungsi benar: {item.func}</p>
                )}
              </div>

              <div className="md:col-span-1 flex justify-end">
                {submitted && (ok ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XIcon size={18} className="text-red-600" />)}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-200">
          {submitted ? (
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Award size={20} />
              Skor Anda: {score} / {toolbarItems.length} ({Math.round((score / toolbarItems.length) * 100)}%)
            </div>
          ) : (
            <span className="text-xs text-gray-500">Pilih semua fungsi lalu klik Periksa Jawaban.</span>
          )}
          <div className="flex gap-2">
            <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-1.5">
              <RotateCcw size={15} /> Reset
            </button>
            {!submitted && (
              <button onClick={handleCheck} className="btn-primary text-sm">
                Periksa Jawaban
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise4;

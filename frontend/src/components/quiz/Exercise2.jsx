import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowUp, ArrowDown } from 'lucide-react';

const matchingItems = [
  {
    id: 'm1',
    term: 'Traffic',
    answer: 'Jumlah kunjungan dan aktivitas pengguna yang masuk ke sebuah website dalam periode tertentu.',
  },
  {
    id: 'm2',
    term: 'Meta Tag',
    answer: 'Kode HTML tersembunyi di bagian <head> yang memberi info deskripsi & kata kunci kepada search engine.',
  },
  {
    id: 'm3',
    term: 'Visitor Map',
    answer: 'Peta geografis yang menunjukkan negara atau kota asal para pengunjung website.',
  },
  {
    id: 'm4',
    term: 'User Profile',
    answer: 'Data karakteristik pengunjung seperti perangkat yang digunakan (desktop/mobile), usia, atau browser.',
  },
  {
    id: 'm5',
    term: 'Page Optimisation',
    answer: 'Upaya meningkatkan kecepatan loading, struktur SEO, dan kenyamanan halaman agar peringkat naik.',
  },
];

const shuffledDefinitions = [
  matchingItems[2].answer,
  matchingItems[4].answer,
  matchingItems[0].answer,
  matchingItems[3].answer,
  matchingItems[1].answer,
];

const correctNavOrder = [
  'Buka aplikasi Web Browser (seperti Chrome atau Firefox)',
  'Ketik alamat URL website di Address Bar lalu tekan Enter',
  'Browser melakukan DNS Lookup & mengirim HTTP Request ke server',
  'Server mengirim file halaman dan Browser menampilkannya di layar',
];

const initialNavOrder = [
  correctNavOrder[2],
  correctNavOrder[0],
  correctNavOrder[3],
  correctNavOrder[1],
];

const Exercise2 = ({ onScoreUpdate }) => {
  const [matchAnswers, setMatchAnswers] = useState({});
  const [navOrder, setNavOrder] = useState(initialNavOrder);
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (index, direction) => {
    if (submitted) return;
    const target = index + direction;
    if (target < 0 || target >= navOrder.length) return;
    const copy = [...navOrder];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setNavOrder(copy);
  };

  const handleCheck = () => {
    let correct = 0;
    matchingItems.forEach((m) => {
      if (matchAnswers[m.id] === m.answer) correct += 1;
    });
    navOrder.forEach((step, idx) => {
      if (step === correctNavOrder[idx]) correct += 1;
    });
    setSubmitted(true);
    onScoreUpdate?.(2, correct, matchingItems.length + correctNavOrder.length);
  };

  const handleReset = () => {
    setMatchAnswers({});
    setNavOrder(initialNavOrder);
    setSubmitted(false);
  };

  const totalMax = matchingItems.length + correctNavOrder.length;
  const currentScore =
    matchingItems.filter((m) => matchAnswers[m.id] === m.answer).length +
    navOrder.filter((step, idx) => step === correctNavOrder[idx]).length;

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-extrabold text-gray-900">Latihan 2: Istilah Analisis Web &amp; Urutan Navigasi Browser</h3>
        <p className="text-sm text-gray-500 mt-1">
          Bagian A: Cocokkan 5 istilah analisis web dengan definisinya. Bagian B: Susun urutan langkah navigasi browser dari awal hingga halaman tampil.
        </p>
      </div>

      {/* Bagian A: Matching */}
      <div className="card space-y-4">
        <h4 className="font-bold text-gray-800">Bagian A — Mencocokkan Istilah Analisis Web</h4>
        {matchingItems.map((item) => {
          const val = matchAnswers[item.id] || '';
          const ok = val === item.answer;
          return (
            <div key={item.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 font-bold text-blue-700 text-sm">{item.term}</div>
              <div className="md:col-span-8">
                <select
                  value={val}
                  onChange={(e) => !submitted && setMatchAnswers({ ...matchAnswers, [item.id]: e.target.value })}
                  disabled={submitted}
                  className={`input-field text-xs ${
                    submitted ? (ok ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50') : ''
                  }`}
                >
                  <option value="">-- pilih definisi yang sesuai --</option>
                  {shuffledDefinitions.map((def, idx) => (
                    <option key={idx} value={def}>{def}</option>
                  ))}
                </select>
                {submitted && !ok && (
                  <p className="text-xs text-red-600 mt-1">Jawaban benar: {item.answer}</p>
                )}
              </div>
              <div className="md:col-span-1 flex justify-end">
                {submitted && (ok ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-red-600" />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bagian B: Ordering Browser Navigation */}
      <div className="card space-y-3">
        <h4 className="font-bold text-gray-800">Bagian B — Urutkan Langkah Cara Navigasi Browser (Gunakan Panah Atas/Bawah)</h4>
        {navOrder.map((step, idx) => {
          const ok = step === correctNavOrder[idx];
          return (
            <div
              key={step}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                submitted
                  ? ok
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{step}</p>
                  {submitted && !ok && (
                    <p className="text-xs text-red-600">Seharusnya langkah #{correctNavOrder.indexOf(step) + 1}</p>
                  )}
                </div>
              </div>
              {!submitted && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === navOrder.length - 1}
                    className="p-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-200">
          {submitted ? (
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Award size={20} />
              Skor Anda: {currentScore} / {totalMax} ({Math.round((currentScore / totalMax) * 100)}%)
            </div>
          ) : (
            <span className="text-xs text-gray-500">Selesaikan Bagian A &amp; B lalu klik Periksa.</span>
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

export default Exercise2;

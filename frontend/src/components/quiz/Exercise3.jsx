import { useState } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

const sequenceMarkers = ['First', 'Secondly', 'Thirdly', 'Then', 'Next', 'After That', 'Finally'];

const correctStages = [
  'Information Gathering (Menentukan tujuan & target audiens)',
  'Planning (Membuat Sitemap dan Wireframe)',
  'Design (Merancang tampilan visual UI/UX)',
  'Content Writing & Assembly (Menulis teks & menyiapkan media)',
  'Coding (Mengimplementasikan kode Frontend & Backend)',
  'Testing, Review & Launch (Uji coba & unggah ke server)',
  'Maintenance (Pemeliharaan & pembaruan rutin)',
];

const initialShuffled = [
  correctStages[3],
  correctStages[0],
  correctStages[5],
  correctStages[1],
  correctStages[6],
  correctStages[2],
  correctStages[4],
];

const Exercise3 = ({ onScoreUpdate }) => {
  const [stages, setStages] = useState(initialShuffled);
  const [submitted, setSubmitted] = useState(false);

  const moveStage = (idx, dir) => {
    if (submitted) return;
    const target = idx + dir;
    if (target < 0 || target >= stages.length) return;
    const copy = [...stages];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setStages(copy);
  };

  const handleCheck = () => {
    const score = stages.filter((s, idx) => s === correctStages[idx]).length;
    setSubmitted(true);
    onScoreUpdate?.(3, score, correctStages.length);
  };

  const handleReset = () => {
    setStages(initialShuffled);
    setSubmitted(false);
  };

  const score = stages.filter((s, idx) => s === correctStages[idx]).length;

  return (
    <div className="space-y-5">
      <div className="card">
        <h3 className="text-xl font-extrabold text-gray-900">Latihan 3: Mengurutkan 7 Langkah Website Development Process</h3>
        <p className="text-sm text-gray-500 mt-1">
          Susun ke-7 tahapan pembuatan website agar sesuai dengan kata penanda urutan: <strong>First → Secondly → Thirdly → Then → Next → After That → Finally</strong>.
        </p>
      </div>

      <div className="card space-y-3">
        {stages.map((stage, idx) => {
          const isCorrect = stage === correctStages[idx];
          return (
            <div
              key={stage}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold min-w-[84px] text-center">
                  {sequenceMarkers[idx]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{stage}</p>
                  {submitted && !isCorrect && (
                    <p className="text-xs text-red-600">
                      Posisi benar: {sequenceMarkers[correctStages.indexOf(stage)]} (#{correctStages.indexOf(stage) + 1})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {submitted ? (
                  isCorrect ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-red-600" />
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveStage(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveStage(idx, 1)}
                      disabled={idx === stages.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-200">
          {submitted ? (
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Award size={20} />
              Skor Anda: {score} / {correctStages.length} ({Math.round((score / correctStages.length) * 100)}%)
            </div>
          ) : (
            <span className="text-xs text-gray-500">Gunakan tombol panah untuk memindahkan urutan.</span>
          )}
          <div className="flex gap-2">
            <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-1.5">
              <RotateCcw size={15} /> Reset
            </button>
            {!submitted && (
              <button onClick={handleCheck} className="btn-primary text-sm">
                Periksa Urutan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise3;

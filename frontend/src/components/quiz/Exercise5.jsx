import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { vocabularyList } from '../materi/VocabularyDict';

const allTerms = vocabularyList.map((v) => v.term);

const Exercise5 = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = () => {
    const score = vocabularyList.filter((_, idx) => answers[idx] === vocabularyList[idx].term).length;
    setSubmitted(true);
    onScoreUpdate?.(5, score, vocabularyList.length);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = vocabularyList.filter((_, idx) => answers[idx] === vocabularyList[idx].term).length;

  return (
    <div className="space-y-5">
      <div className="card">
        <h3 className="text-xl font-extrabold text-gray-900">Latihan 5: Vocabulary Practice (Tebak 12 Istilah Website)</h3>
        <p className="text-sm text-gray-500 mt-1">
          Baca definisi nomor 1 sampai 12 dengan cermat, lalu pilih istilah kosakata website yang tepat.
        </p>
      </div>

      <div className="card space-y-4">
        {vocabularyList.map((item, idx) => {
          const val = answers[idx] || '';
          const ok = val === item.term;
          return (
            <div key={item.term} className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <span className="text-xs font-bold text-blue-600">Definisi #{idx + 1}</span>
                <p className="text-sm text-gray-800 mt-0.5 leading-relaxed">{item.definition}</p>
                {submitted && !ok && (
                  <p className="text-xs text-red-600 mt-1 font-semibold">Istilah yang benar: {item.term}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <select
                  value={val}
                  onChange={(e) => !submitted && setAnswers({ ...answers, [idx]: e.target.value })}
                  disabled={submitted}
                  className={`input-field text-xs font-semibold ${
                    submitted ? (ok ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50') : ''
                  }`}
                >
                  <option value="">-- pilih istilah --</option>
                  {allTerms.map((term) => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1 flex justify-end">
                {submitted && (ok ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-red-600" />)}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-200">
          {submitted ? (
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Award size={20} />
              Skor Anda: {score} / {vocabularyList.length} ({Math.round((score / vocabularyList.length) * 100)}%)
            </div>
          ) : (
            <span className="text-xs text-gray-500">Jawab seluruh 12 definisi lalu klik Periksa Jawaban.</span>
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

export default Exercise5;

import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

const wordBank = [
  'traffic',
  'analytics',
  'visitor map',
  'user profile',
  'meta tags',
  'page optimisation',
];

const dialogueBlanks = [
  {
    id: 1,
    speaker: 'Sarah',
    before: 'Hi George! Have you checked our website',
    after: 'report for this month?',
    answer: 'analytics',
  },
  {
    id: 2,
    speaker: 'George',
    before: 'Yes, I just opened it. Our overall',
    after: 'increased by 25% compared to last month!',
    answer: 'traffic',
  },
  {
    id: 3,
    speaker: 'Sarah',
    before: 'That is great news! Where are most of our visitors coming from? Did you look at the',
    after: '?',
    answer: 'visitor map',
  },
  {
    id: 4,
    speaker: 'George',
    before: 'Sure, most of them are from Jakarta and Surabaya. Also, according to the',
    after: 'data, 70% access our POS site from desktop monitors.',
    answer: 'user profile',
  },
  {
    id: 5,
    speaker: 'Sarah',
    before: 'Awesome. To keep improving our search ranking, we should update our',
    after: 'with relevant keywords.',
    answer: 'meta tags',
  },
  {
    id: 6,
    speaker: 'George',
    before: 'Agreed! And let us run a speed check for',
    after: 'so the pages load even faster.',
    answer: 'page optimisation',
  },
];

const Exercise1 = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleCheck = () => {
    let correct = 0;
    dialogueBlanks.forEach((b) => {
      if (answers[b.id] === b.answer) correct += 1;
    });
    setSubmitted(true);
    onScoreUpdate?.(1, correct, dialogueBlanks.length);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = dialogueBlanks.filter((b) => answers[b.id] === b.answer).length;

  return (
    <div className="space-y-5">
      <div className="card">
        <h3 className="text-xl font-extrabold text-gray-900">Latihan 1: Melengkapi Dialog Laporan Traffic Website</h3>
        <p className="text-sm text-gray-500 mt-1">
          Lengkapi percakapan antara <strong>Sarah</strong> dan <strong>George</strong> mengenai laporan analisis website menggunakan pilihan kata yang tepat.
        </p>

        {/* Word Bank */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <span className="text-xs font-bold uppercase text-blue-700 block mb-2">Word Bank (Pilihan Istilah):</span>
          <div className="flex flex-wrap gap-2">
            {wordBank.map((w) => (
              <span key={w} className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-800">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogue Rows */}
      <div className="card space-y-4">
        {dialogueBlanks.map((item) => {
          const userAns = answers[item.id] || '';
          const isCorrect = userAns === item.answer;
          return (
            <div key={item.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-800 leading-relaxed">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  item.speaker === 'Sarah' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.speaker}:
                </span>
                <span>{item.before}</span>
                <select
                  value={userAns}
                  onChange={(e) => handleSelect(item.id, e.target.value)}
                  disabled={submitted}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-semibold outline-none ${
                    submitted
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-red-50 border-red-400 text-red-800'
                      : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="">-- pilih kata --</option>
                  {wordBank.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <span>{item.after}</span>

                {submitted && (
                  isCorrect ? (
                    <CheckCircle2 size={18} className="text-emerald-600 ml-auto flex-shrink-0" />
                  ) : (
                    <span className="ml-auto text-xs font-semibold text-red-600 flex items-center gap-1">
                      <XCircle size={16} /> Jawaban: {item.answer}
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-200">
          {submitted ? (
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Award size={20} />
              Skor Anda: {score} / {dialogueBlanks.length} ({Math.round((score / dialogueBlanks.length) * 100)}%)
            </div>
          ) : (
            <span className="text-xs text-gray-500">Isi seluruh bagian kosong lalu klik Periksa Jawaban.</span>
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

export default Exercise1;

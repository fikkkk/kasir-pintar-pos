import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import Exercise1 from '../components/quiz/Exercise1';
import Exercise2 from '../components/quiz/Exercise2';
import Exercise3 from '../components/quiz/Exercise3';
import Exercise4 from '../components/quiz/Exercise4';
import Exercise5 from '../components/quiz/Exercise5';
import Exercise6 from '../components/quiz/Exercise6';

const SCORE_STORAGE_KEY = 'kasir_pintar_quiz_scores';

const exercises = [
  { id: 1, title: 'Latihan 1', subtitle: 'Dialog Traffic (Sarah & George)' },
  { id: 2, title: 'Latihan 2', subtitle: 'Analisis Web & Navigasi Browser' },
  { id: 3, title: 'Latihan 3', subtitle: 'Urutan Dev Process (7 Langkah)' },
  { id: 4, title: 'Latihan 4', subtitle: '11 Tombol Toolbar Browser' },
  { id: 5, title: 'Latihan 5', subtitle: 'Vocabulary Practice (1–12)' },
  { id: 6, title: 'Latihan 6', subtitle: 'Roleplay Dialog Generator' },
];

const QuizPage = () => {
  const [activeExercise, setActiveExercise] = useState(1);
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem(SCORE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  const handleScoreUpdate = (exId, score, maxScore) => {
    setScores((prev) => ({
      ...prev,
      [exId]: { score, maxScore, pct: Math.round((score / maxScore) * 100) },
    }));
  };

  const handleResetAllScores = () => {
    setScores({});
    localStorage.removeItem(SCORE_STORAGE_KEY);
  };

  const completedCount = Object.keys(scores).length;
  const totalPoints = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
  const totalMaxPoints = Object.values(scores).reduce((sum, s) => sum + s.maxScore, 0);
  const avgPct = totalMaxPoints > 0 ? Math.round((totalPoints / totalMaxPoints) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header & Score Summary */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              🎯 Kuis &amp; Latihan Interaktif
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold">Latihan Modul Website (Exercises 1–6)</h1>
            <p className="text-indigo-100 text-sm mt-1">
              Kerjakan seluruh latihan interaktif di bawah ini. Skor Anda tersimpan otomatis di browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3">
              <Trophy size={28} className="text-yellow-300" />
              <div>
                <p className="text-xs text-indigo-100">Progress &amp; Nilai Rata-rata</p>
                <p className="text-lg font-extrabold">
                  {completedCount}/6 Selesai · {avgPct}%
                </p>
              </div>
            </div>
            <Link to="/materi" className="bg-white text-indigo-700 font-bold py-3 px-4 rounded-xl text-sm hover:bg-gray-100 flex items-center gap-1.5">
              <BookOpen size={16} />
              Lihat Materi
            </Link>
            {completedCount > 0 && (
              <button
                onClick={handleResetAllScores}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-3 rounded-xl text-xs font-semibold flex items-center gap-1"
                title="Reset Semua Skor"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {exercises.map((ex) => {
          const active = activeExercise === ex.id;
          const sc = scores[ex.id];
          return (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex.id)}
              className={`p-3 rounded-xl text-left border transition-all ${
                active
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold uppercase">{ex.title}</span>
                {sc && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                    active ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <CheckCircle2 size={10} /> {sc.pct}%
                  </span>
                )}
              </div>
              <p className={`text-[11px] leading-tight ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                {ex.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Exercise Component */}
      <div className="animate-fade-in" key={activeExercise}>
        {activeExercise === 1 && <Exercise1 onScoreUpdate={handleScoreUpdate} />}
        {activeExercise === 2 && <Exercise2 onScoreUpdate={handleScoreUpdate} />}
        {activeExercise === 3 && <Exercise3 onScoreUpdate={handleScoreUpdate} />}
        {activeExercise === 4 && <Exercise4 onScoreUpdate={handleScoreUpdate} />}
        {activeExercise === 5 && <Exercise5 onScoreUpdate={handleScoreUpdate} />}
        {activeExercise === 6 && <Exercise6 onScoreUpdate={handleScoreUpdate} />}
      </div>
    </div>
  );
};

export default QuizPage;

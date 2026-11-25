import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Globe, Target, GitBranch, Search, BookA, HelpCircle, ArrowRight,
} from 'lucide-react';
import URLSimulator from '../components/materi/URLSimulator';
import PurposeCards from '../components/materi/PurposeCards';
import DevProcess from '../components/materi/DevProcess';
import BrowserAndSERP from '../components/materi/BrowserAndSERP';
import VocabularyDict from '../components/materi/VocabularyDict';

const tabs = [
  { id: 'url', label: '1. Definisi & Anatomi URL', icon: Globe },
  { id: 'purpose', label: '2. 7 Tujuan Website', icon: Target },
  { id: 'process', label: '3. Proses Development', icon: GitBranch },
  { id: 'browser', label: '4. Browser & SERP', icon: Search },
  { id: 'kamus', label: '5. Kamus Istilah (12)', icon: BookA },
];

const MateriPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [activeTab, setActiveTab] = useState(initialSearch ? 'kamus' : 'url');

  useEffect(() => {
    if (initialSearch) {
      setActiveTab('kamus');
    }
  }, [initialSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              📚 Modul Edukasi Komprehensif
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold">Materi &amp; Edukasi Website</h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Pelajari konsep dasar website, struktur URL, 7 tujuan website, tahapan pembuatan web, cara kerja browser &amp; search engine (SERP), serta 12 kosakata wajib.
            </p>
          </div>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold py-3 px-5 rounded-xl hover:bg-gray-100 transition-all shadow-md flex-shrink-0 text-sm"
          >
            <HelpCircle size={18} />
            Uji Pemahaman di Kuis (1–6)
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'url' && <URLSimulator />}
        {activeTab === 'purpose' && <PurposeCards />}
        {activeTab === 'process' && <DevProcess />}
        {activeTab === 'browser' && <BrowserAndSERP />}
        {activeTab === 'kamus' && <VocabularyDict initialQuery={initialSearch} />}
      </div>
    </div>
  );
};

export default MateriPage;

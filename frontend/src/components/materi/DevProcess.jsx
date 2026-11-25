import { useState } from 'react';
import {
  ClipboardList, Map, Palette, FileEdit, Code2, CheckSquare, Wrench, ArrowRight,
} from 'lucide-react';

const steps = [
  {
    step: 1,
    seq: 'First',
    title: 'Information Gathering',
    subtitle: 'Pengumpulan Informasi',
    icon: ClipboardList,
    color: 'bg-blue-600',
    desc: 'Menentukan tujuan website (Purpose), target audiens (Target Audience), konten yang dibutuhkan, dan fitur utama.',
    deliverables: ['Dokumen Tujuan & Target Pengguna', 'Daftar Kebutuhan Fitur', 'Riset Kompetitor'],
  },
  {
    step: 2,
    seq: 'Secondly',
    title: 'Planning (Sitemap & Wireframe)',
    subtitle: 'Perencanaan Struktur',
    icon: Map,
    color: 'bg-indigo-600',
    desc: 'Menyusun Sitemap (peta struktur halaman & navigasi) dan Wireframe (sketsa tata letak/layout kasar tiap halaman).',
    deliverables: ['Sitemap Hierarki Halaman', 'Wireframe Low-Fidelity', 'Skema Database & Tech Stack'],
  },
  {
    step: 3,
    seq: 'Thirdly',
    title: 'Design',
    subtitle: 'Desain Visual UI/UX',
    icon: Palette,
    color: 'bg-purple-600',
    desc: 'Merancang tampilan visual yang menarik: pemilihan skema warna, tipografi, logo, ikonografi, dan mockup high-fidelity.',
    deliverables: ['Mockup UI Desktop & Mobile', 'Color Palette & Typography', 'Design System / Prototype'],
  },
  {
    step: 4,
    seq: 'Then',
    title: 'Content Writing & Assembly',
    subtitle: 'Penulisan & Penyusunan Konten',
    icon: FileEdit,
    color: 'bg-pink-600',
    desc: 'Menyiapkan seluruh teks (copywriting), gambar produk, video/audio (hypermedia), serta optimasi kata kunci SEO.',
    deliverables: ['Headline & CTA Copywriting', 'Aset Foto/Video Terkompresi', 'Meta Tag & Deskripsi SEO'],
  },
  {
    step: 5,
    seq: 'Next',
    title: 'Coding',
    subtitle: 'Pengembangan Kode',
    icon: Code2,
    color: 'bg-amber-600',
    desc: 'Mengubah desain menjadi website nyata menggunakan HTML, CSS, JavaScript/React (Frontend) serta Backend API & Database.',
    deliverables: ['Frontend React + Tailwind', 'REST API Express.js', 'Integrasi Database MySQL'],
  },
  {
    step: 6,
    seq: 'After That',
    title: 'Testing, Review & Launch',
    subtitle: 'Pengujian & Peluncuran',
    icon: CheckSquare,
    color: 'bg-emerald-600',
    desc: 'Menguji semua link, form, kompatibilitas browser, kecepatan loading, keamanan, lalu mengunggah (deploy) ke server live.',
    deliverables: ['Uji Fungsional & Responsif', 'Cross-Browser Testing', 'Deploy ke Domain Live'],
  },
  {
    step: 7,
    seq: 'Finally',
    title: 'Maintenance',
    subtitle: 'Pemeliharaan Berkelanjutan',
    icon: Wrench,
    color: 'bg-slate-700',
    desc: 'Memantau performa, backup database rutin, memperbarui konten/stok, memperbaiki bug, dan menjaga keamanan sistem.',
    deliverables: ['Monitoring Uptime & Analytics', 'Backup Database Berkala', 'Update Fitur & Patch Keamanan'],
  },
];

const DevProcess = () => {
  const [selectedStep, setSelectedStep] = useState(0);
  const current = steps[selectedStep];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-extrabold text-gray-900">7 Tahapan Website Development Process</h2>
        <p className="text-sm text-gray-500 mt-1">
          Klik setiap tahapan pada timeline di bawah untuk melihat detail aktivitas dan hasil (deliverables) beserta kata hubung urutannya.
        </p>
      </div>

      {/* Interactive Horizontal Timeline */}
      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2 pb-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const active = idx === selectedStep;
            return (
              <div key={s.step} className="flex items-center flex-1">
                <button
                  onClick={() => setSelectedStep(idx)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl w-full transition-all ${
                    active ? 'bg-blue-50 ring-2 ring-blue-500 scale-[1.03]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                    {s.seq}
                  </span>
                  <div className={`w-11 h-11 rounded-full ${s.color} text-white flex items-center justify-center shadow-md mb-2`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">{s.step}. {s.title}</p>
                </button>
                {idx < steps.length - 1 && (
                  <ArrowRight size={16} className="text-gray-300 flex-shrink-0 mx-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail */}
      <div className="card border-l-4 border-blue-600 animate-fade-in" key={current.step}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${current.color} text-white flex items-center justify-center`}>
              <current.icon size={24} />
            </div>
            <div>
              <span className="badge bg-blue-100 text-blue-800 mb-1">
                Step {current.step} · Sequence Word: "{current.seq}"
              </span>
              <h3 className="text-xl font-extrabold text-gray-900">
                {current.title} <span className="text-gray-400 font-normal text-base">({current.subtitle})</span>
              </h3>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStep((prev) => Math.max(0, prev - 1))}
              disabled={selectedStep === 0}
              className="btn-secondary text-xs !py-2 !px-3 disabled:opacity-40"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() => setSelectedStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={selectedStep === steps.length - 1}
              className="btn-primary text-xs !py-2 !px-3 disabled:opacity-40"
            >
              Selanjutnya →
            </button>
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">{current.desc}</p>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-bold uppercase text-gray-500 mb-2">Hasil Utama (Deliverables):</p>
          <div className="flex flex-wrap gap-2">
            {current.deliverables.map((d) => (
              <span key={d} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                ✓ {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevProcess;

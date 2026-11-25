import { useState } from 'react';
import { Search, BookA } from 'lucide-react';

export const vocabularyList = [
  {
    term: 'Spider / Webcrawler',
    category: 'Search Engine',
    definition: 'Program otomatis (bot) milik mesin pencari yang terus menjelajahi internet mengikuti hyperlink untuk menemukan halaman baru dan memperbarui indeks pencarian.',
  },
  {
    term: 'Hyperlink',
    category: 'Navigasi Web',
    definition: 'Elemen teks, gambar, atau tombol pada halaman web yang apabila diklik akan mengarahkan pengguna ke halaman lain atau bagian tertentu di internet.',
  },
  {
    term: 'Domain Name',
    category: 'Alamat Web',
    definition: 'Nama unik yang mudah diingat untuk mengidentifikasi alamat suatu website di internet (contoh: kasirpintar-pos.co.id), menggantikan angka IP address.',
  },
  {
    term: 'Organic Result',
    category: 'SERP / SEO',
    definition: 'Hasil pencarian di SERP yang muncul secara alami berdasarkan algoritma relevansi dan optimasi SEO, bukan hasil dari iklan berbayar.',
  },
  {
    term: 'Web Portal',
    category: 'Jenis Website',
    definition: 'Website gerbang informasi terpadu yang mengumpulkan beragam konten dan layanan (berita, pencarian, email, cuaca) dari berbagai sumber ke dalam satu halaman.',
  },
  {
    term: 'SERP',
    category: 'Search Engine',
    definition: 'Search Engine Results Page — halaman yang ditampilkan oleh mesin pencari sebagai respons atas kata kunci (query) yang diketikkan pengguna, berisi iklan & hasil organik.',
  },
  {
    term: 'Bookmarks / Favourites',
    category: 'Web Browser',
    definition: 'Fitur pada web browser untuk menyimpan alamat URL halaman web favorit agar pengguna dapat membukanya kembali dengan cepat tanpa mengetik ulang.',
  },
  {
    term: 'URL',
    category: 'Alamat Web',
    definition: 'Uniform Resource Locator — alamat lengkap dan unik dari sebuah sumber daya (halaman web, gambar, file) di internet, contoh: https://www.kasirpintar-pos.co.id/pos.',
  },
  {
    term: 'HTTP',
    category: 'Protokol',
    definition: 'Hypertext Transfer Protocol — protokol komunikasi standar yang digunakan oleh web browser dan web server untuk saling bertukar data halaman web (HTTPS untuk versi terenkripsi).',
  },
  {
    term: 'Web Indexes',
    category: 'Search Engine',
    definition: 'Basis data besar milik search engine yang menyimpan dan mengelompokkan halaman-halaman web hasil penjelajahan spider agar bisa dicari dalam hitungan milidetik.',
  },
  {
    term: 'Directory Path',
    category: 'Anatomi URL',
    definition: 'Bagian dalam URL setelah nama domain yang menunjukkan lokasi folder atau jalur direktori tempat file halaman web disimpan di server (contoh: /produk/minuman/).',
  },
  {
    term: 'Hypermedia',
    category: 'Konten Web',
    definition: 'Pengembangan dari hypertext yang menggabungkan teks, grafik/gambar, audio, video, dan hyperlink secara interaktif dalam sebuah website.',
  },
];

const VocabularyDict = ({ initialQuery = '' }) => {
  const [search, setSearch] = useState(initialQuery);

  const filtered = vocabularyList.filter((v) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      v.term.toLowerCase().includes(q) ||
      v.definition.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <BookA size={24} className="text-blue-600" />
              Kamus Istilah Website (12 Vocabulary Wajib)
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cari dan pelajari definisi istilah penting seputar website, browser, dan mesin pencari.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari istilah website..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10 text-gray-500">
          Tidak ditemukan istilah yang cocok dengan "{search}".
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.term} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-400 transition-all">
              <span className="badge bg-blue-50 text-blue-700 mb-2">{item.category}</span>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">{item.term}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.definition}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VocabularyDict;

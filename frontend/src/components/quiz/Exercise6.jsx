import { useState } from 'react';
import { Copy, Check, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const topicTemplates = {
  pos: {
    label: 'Website Toko & Kasir (To Sales)',
    siteName: 'Kasir Pintar POS',
    domain: 'https://www.kasirpintar-pos.co.id',
    purpose: 'To Sales (eCommerce & Point of Sale)',
    features: 'Search Bar, Product Grid, Shopping Cart, Thermal Receipt, dan Live Chat',
    browserFlow: 'membuka browser, mengetik URL di address bar, mencari produk lewat Search Bar, lalu memproses transaksi di halaman Kasir POS',
  },
  news: {
    label: 'Website Portal Berita (To Inform)',
    siteName: 'Portal Berita Nusantara',
    domain: 'https://www.beritanusantara.co.id',
    purpose: 'To Inform (Menyampaikan berita & informasi terkini)',
    features: 'Navigation Bar kategori berita, Search Bar artikel, Hypermedia (foto & video berita), dan Subscriber Newsletter',
    browserFlow: 'mencari kata kunci di Search Engine, mengklik Organic Result pada halaman SERP, lalu menyimpan halaman ke Bookmarks',
  },
  portfolio: {
    label: 'Website Portfolio (To Present)',
    siteName: 'Studio Kreatif Digital',
    domain: 'https://www.studiokreatif.id',
    purpose: 'To Present (Menampilkan karya, profil, dan keahlian)',
    features: 'Logo & Company Name, Hero Slideshow karya, Testimonials klien, CTA "Hubungi Kami", dan Contact Form',
    browserFlow: 'mengakses URL melalui hyperlink di LinkedIn, melihat galeri karya, lalu menekan tombol Mail atau Contact untuk bekerja sama',
  },
};

const Exercise6 = ({ onScoreUpdate }) => {
  const [speakerA, setSpeakerA] = useState('Andi');
  const [speakerB, setSpeakerB] = useState('Bela');
  const [topicKey, setTopicKey] = useState('pos');
  const [language, setLanguage] = useState('bilingual');
  const [copied, setCopied] = useState(false);

  const tpl = topicTemplates[topicKey];

  const generateLines = () => {
    if (language === 'english') {
      return [
        { s: speakerA, text: `Hi ${speakerB}! For our presentation today, let's discuss our website project "${tpl.siteName}".` },
        { s: speakerB, text: `Sure ${speakerA}! First, what is the domain name and main purpose of this website?` },
        { s: speakerA, text: `The domain is ${tpl.domain}. Its main purpose is ${tpl.purpose}.` },
        { s: speakerB, text: `Great! How did we build it according to the 7 Website Development Process stages?` },
        { s: speakerA, text: `First, we did Information Gathering. Secondly, Planning with a Sitemap and Wireframe. Thirdly, Design. Then, Content Writing & Assembly. Next, Coding. After that, Testing & Launch. Finally, Maintenance.` },
        { s: speakerB, text: `And what key website features are included on the homepage?` },
        { s: speakerA, text: `It includes ${tpl.features}. Visitors can also find our site through Organic Results on SERP thanks to good Meta Tags and Page Optimisation.` },
        { s: speakerB, text: `Awesome! Thank you everyone for listening to our roleplay presentation!` },
      ];
    }

    return [
      { s: speakerA, text: `Halo ${speakerB}! Untuk tugas presentasi berpasangan hari ini, mari kita bahas website "${tpl.siteName}".` },
      { s: speakerB, text: `Siap ${speakerA}! Pertama, apa Domain Name dan tujuan utama (Purpose) dari website ini?` },
      { s: speakerA, text: `Alamat URL-nya adalah ${tpl.domain}. Tujuan utamanya adalah ${tpl.purpose}.` },
      { s: speakerB, text: `Menarik! Bagaimana tahapan pembuatannya berdasarkan 7 langkah Website Development Process?` },
      { s: speakerA, text: `First, Information Gathering (riset kebutuhan). Secondly, Planning (membuat Sitemap & Wireframe). Thirdly, Design UI/UX. Then, Content Writing & Assembly (menyiapkan teks & hypermedia). Next, Coding. After that, Testing & Launch. Finally, Maintenance.` },
      { s: speakerB, text: `Lalu bagaimana cara pengguna mengakses website ini melalui web browser?` },
      { s: speakerA, text: `Pengguna cukup ${tpl.browserFlow}. Di homepage juga tersedia ${tpl.features}.` },
      { s: speakerB, text: `Bagaimana agar website kita mudah ditemukan di mesin pencari (SERP)?` },
      { s: speakerA, text: `Kita mengoptimalkan Meta Tag dan Page Optimisation agar Spider/Webcrawler mengindeks halaman kita ke Web Indexes dan muncul di Organic Results.` },
      { s: speakerB, text: `Luar biasa! Terima kasih atas kerja samanya, ${speakerA}. Sekian presentasi roleplay dari kami!` },
    ];
  };

  const lines = generateLines();

  const handleCopy = () => {
    const plainText = lines.map((l) => `${l.s}: ${l.text}`).join('\n');
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    onScoreUpdate?.(6, 1, 1);
    toast.success('Naskah dialog berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="card">
        <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <Users size={22} className="text-blue-600" />
          Latihan 6: Template Generator Roleplay Percakapan Website
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Buat naskah dialog presentasi berpasangan tentang Website secara otomatis. Sesuaikan nama pembicara, topik website, dan bahasa.
        </p>
      </div>

      {/* Form Konfigurasi */}
      <div className="card grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600">Nama Pembicara A</label>
          <input
            type="text"
            value={speakerA}
            onChange={(e) => setSpeakerA(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">Nama Pembicara B</label>
          <input
            type="text"
            value={speakerB}
            onChange={(e) => setSpeakerB(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">Topik Website</label>
          <select
            value={topicKey}
            onChange={(e) => setTopicKey(e.target.value)}
            className="input-field mt-1"
          >
            {Object.entries(topicTemplates).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">Bahasa Naskah</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field mt-1"
          >
            <option value="bilingual">Indonesia + Istilah Inggris</option>
            <option value="english">Full English</option>
          </select>
        </div>
      </div>

      {/* Generated Dialogue Script */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            <h4 className="font-bold text-gray-800">Hasil Naskah Percakapan Roleplay</h4>
          </div>
          <button onClick={handleCopy} className="btn-primary text-xs flex items-center gap-1.5 !py-2 !px-3.5">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Tersalin!' : 'Salin Naskah'}
          </button>
        </div>

        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${
                line.s === speakerA ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {line.s}
              </span>
              <p className="text-sm text-gray-800 leading-relaxed">{line.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercise6;

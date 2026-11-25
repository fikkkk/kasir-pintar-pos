import {
  ShoppingBag, Newspaper, Landmark, Users, UserCheck, Film, Briefcase, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const purposes = [
  {
    number: 1,
    title: 'To Sales (Menjual)',
    subtitle: 'eCommerce & Point of Sale',
    desc: 'Website yang dibuat untuk menjual produk atau jasa secara langsung maupun mendukung transaksi toko.',
    examples: 'Kasir Pintar POS (aplikasi ini), Tokopedia, Shopee, Amazon',
    icon: ShoppingBag,
    color: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    internalLink: '/pos',
  },
  {
    number: 2,
    title: 'To Inform (Menginformasikan)',
    subtitle: 'News & Knowledge Portal',
    desc: 'Menyampaikan berita terkini, artikel edukasi, laporan riset, atau informasi publik secara cepat dan akurat.',
    examples: 'Kompas.com, BBC News, Wikipedia, Detik.com',
    icon: Newspaper,
    color: 'from-emerald-500 to-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    number: 3,
    title: 'To Serve (Melayani)',
    subtitle: 'Government & Public Service',
    desc: 'Memberikan layanan administrasi atau publik kepada masyarakat seperti pajak, perizinan, dan informasi resmi.',
    examples: 'Portal Layanan Publik (gov.uk, go.id), Pajak.go.id, BPJS',
    icon: Landmark,
    color: 'from-indigo-500 to-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    number: 4,
    title: 'To Connect (Menghubungkan)',
    subtitle: 'Directory, Forum & Social Network',
    desc: 'Menghubungkan pengguna dengan sesama pengguna, komunitas, atau direktori bisnis dan lokasi.',
    examples: 'LinkedIn, Yellow Pages Directory, Kaskus, GitHub',
    icon: Users,
    color: 'from-purple-500 to-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    number: 5,
    title: 'To Generate Lead (Menjaring Prospek)',
    subtitle: 'Consultant & B2B Services',
    desc: 'Mengumpulkan data calon klien potensial (melalui form konsultasi, newsletter, atau demo produk) untuk layanan jasa.',
    examples: 'Website Konsultan Pajak, Agensi Digital, SaaS Landing Page',
    icon: UserCheck,
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    number: 6,
    title: 'To Entertain (Menghibur)',
    subtitle: 'Video Streaming, Music & Gaming',
    desc: 'Menyajikan konten hiburan seperti video, film, musik, podcast, atau permainan interaktif secara online.',
    examples: 'YouTube, Netflix, Spotify, Twitch',
    icon: Film,
    color: 'from-rose-500 to-pink-700',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    number: 7,
    title: 'To Present (Mempresentasikan)',
    subtitle: 'Portfolio & Company Profile',
    desc: 'Menampilkan karya, keahlian, pengalaman, atau profil perusahaan/individu untuk membangun kredibilitas.',
    examples: 'Behance, Dribbble, Website Portfolio Desainer/Developer',
    icon: Briefcase,
    color: 'from-cyan-500 to-teal-700',
    badge: 'bg-cyan-100 text-cyan-700',
  },
];

const PurposeCards = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-extrabold text-gray-900">7 Tujuan Utama Website (Purpose of Website)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Setiap website dibangun dengan tujuan bisnis atau komunikasi yang spesifik. Berikut 7 kategori tujuan website beserta contohnya.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {purposes.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.number} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
              <div className={`bg-gradient-to-r ${item.color} p-5 text-white flex items-center justify-between`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Tujuan #{item.number}</span>
                  <h3 className="text-lg font-extrabold">{item.title}</h3>
                  <p className="text-xs opacity-90">{item.subtitle}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={24} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="pt-3 border-t border-gray-100">
                  <span className={`badge ${item.badge} mb-1.5`}>Contoh Website</span>
                  <p className="text-xs font-medium text-gray-700">{item.examples}</p>
                  {item.internalLink && (
                    <Link
                      to={item.internalLink}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-2"
                    >
                      Coba langsung di Kasir POS <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurposeCards;

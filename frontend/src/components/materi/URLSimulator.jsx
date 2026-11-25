import { useState } from 'react';
import { Globe, Info, Sparkles } from 'lucide-react';

const sampleUrls = [
  'https://www.kasirpintar-pos.co.id/produk/kasir/checkout.html',
  'https://www.tokopedia.com/elektronik/laptop/index.php',
  'http://portal.kampus.ac.id/akademik/jadwal/kuliah.pdf',
  'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
];

const parseUrlParts = (rawUrl) => {
  const trimmed = rawUrl.trim();
  const regex = /^(https?):\/\/([^/:?#]+)(:\d+)?(\/[^?#]*?)?(\/[^/?#]+\.[a-zA-Z0-9]+)?(\?[^#]*)?(#.*)?$/;

  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const scheme = u.protocol.replace(':', '');
    const hostnameParts = u.hostname.split('.');
    const hasWww = hostnameParts[0] === 'www';
    const host = hasWww ? 'www' : (hostnameParts.length > 2 ? hostnameParts[0] : '(tanpa subdomain)');
    const domain = hasWww
      ? hostnameParts.slice(1).join('.')
      : hostnameParts.length > 2
        ? hostnameParts.slice(1).join('.')
        : u.hostname;

    const pathname = u.pathname || '/';
    const segments = pathname.split('/').filter(Boolean);
    const lastSeg = segments[segments.length - 1] || '';
    const hasFileExt = lastSeg.includes('.');

    const filename = hasFileExt ? lastSeg : '(default: index.html)';
    const dirSegments = hasFileExt ? segments.slice(0, -1) : segments;
    const directoryPath = dirSegments.length > 0 ? `/${dirSegments.join('/')}/` : '/';

    return {
      valid: true,
      scheme,
      host,
      domain,
      directoryPath,
      filename,
      query: u.search || '',
      fullUrl: u.href,
    };
  } catch {
    return { valid: false, match: regex.test(trimmed) };
  }
};

const URLSimulator = () => {
  const [urlInput, setUrlInput] = useState(sampleUrls[0]);
  const parsed = parseUrlParts(urlInput);

  const partsInfo = [
    {
      key: 'scheme',
      label: 'Scheme / Protocol',
      value: parsed.scheme,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      badge: 'bg-blue-600',
      desc: 'Aturan komunikasi antara browser & server (HTTP atau HTTPS yang terenkripsi SSL/TLS).',
    },
    {
      key: 'host',
      label: 'Host / Subdomain',
      value: parsed.host,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badge: 'bg-emerald-600',
      desc: 'Nama server/subdomain spesifik, umumnya "www" (World Wide Web) atau subdomain seperti "portal".',
    },
    {
      key: 'domain',
      label: 'Domain Name',
      value: parsed.domain,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      badge: 'bg-purple-600',
      desc: 'Alamat unik identitas website di internet (terdiri dari nama domain + TLD seperti .co.id, .com, .org).',
    },
    {
      key: 'directoryPath',
      label: 'Directory Path',
      value: parsed.directoryPath,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      badge: 'bg-amber-600',
      desc: 'Lokasi folder atau struktur hierarki halaman di dalam web server.',
    },
    {
      key: 'filename',
      label: 'Filename',
      value: parsed.filename,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      badge: 'bg-rose-600',
      desc: 'Nama file spesifik yang diakses (misalnya index.html, checkout.html, atau dokumen PDF).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Definisi Website (Cambridge Dictionary) */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <Globe size={22} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Definisi Website (Cambridge Dictionary)</span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">Apa itu Website?</h2>
            <blockquote className="mt-2 p-3 bg-white/80 rounded-xl border-l-4 border-blue-600 text-sm text-gray-700 italic">
              "A set of pages of information on the internet about a particular subject, published by a single person or organization."
            </blockquote>
            <p className="text-sm text-gray-600 mt-2">
              Artinya: Kumpulan halaman informasi di internet mengenai suatu topik/subjek tertentu yang saling terhubung melalui <strong>hyperlink</strong> dan dipublikasikan oleh individu maupun organisasi di bawah satu <strong>Domain Name</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Interaktif Anatomi URL */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Simulator Interaktif Anatomi URL</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Ketik URL apa saja di bawah ini atau pilih contoh untuk melihat pemecahan struktur URL secara otomatis.
        </p>

        {/* Input URL */}
        <div className="mb-3">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://www.contoh.co.id/folder/halaman.html"
            className="input-field font-mono text-sm"
          />
        </div>

        {/* Sample Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-gray-500 self-center">Contoh cepat:</span>
          {sampleUrls.map((u, idx) => (
            <button
              key={idx}
              onClick={() => setUrlInput(u)}
              className={`text-xs px-3 py-1 rounded-full font-mono transition-colors border ${
                urlInput === u
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Contoh #{idx + 1}
            </button>
          ))}
        </div>

        {!parsed.valid ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            Format URL belum valid. Pastikan menyertakan format seperti <code className="font-mono">https://www.domain.com/path/file.html</code>.
          </div>
        ) : (
          <>
            {/* Visual Breakdown */}
            <div className="p-4 bg-gray-900 rounded-xl font-mono text-sm md:text-base overflow-x-auto mb-6 flex flex-wrap items-center gap-1">
              <span className="px-2 py-1 rounded bg-blue-500/30 text-blue-300 border border-blue-400/40" title="Scheme">
                {parsed.scheme}://
              </span>
              {parsed.host !== '(tanpa subdomain)' && (
                <span className="px-2 py-1 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40" title="Host">
                  {parsed.host}.
                </span>
              )}
              <span className="px-2 py-1 rounded bg-purple-500/30 text-purple-300 border border-purple-400/40" title="Domain">
                {parsed.domain}
              </span>
              <span className="px-2 py-1 rounded bg-amber-500/30 text-amber-300 border border-amber-400/40" title="Directory Path">
                {parsed.directoryPath}
              </span>
              <span className="px-2 py-1 rounded bg-rose-500/30 text-rose-300 border border-rose-400/40" title="Filename">
                {parsed.filename}
              </span>
            </div>

            {/* 5 Parts Detail Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partsInfo.map((part) => (
                <div key={part.key} className={`p-4 rounded-xl border ${part.color}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider">{part.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${part.badge}`} />
                  </div>
                  <p className="font-mono font-bold text-base break-all mb-2">{part.value}</p>
                  <p className="text-xs opacity-85 leading-relaxed flex items-start gap-1.5">
                    <Info size={13} className="flex-shrink-0 mt-0.5" />
                    {part.desc}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default URLSimulator;

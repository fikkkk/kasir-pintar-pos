import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, X, Home, ShoppingCart, Package, BarChart3, BookOpen, HelpCircle,
  LogIn, LogOut, User, ChevronDown, Search, LayoutDashboard, Phone, Globe,
} from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // Cek apakah kata kunci lebih cocok ke materi edukasi website
    const materiKeywords = [
      'url', 'http', 'https', 'domain', 'browser', 'serp', 'spider', 'webcrawler',
      'hyperlink', 'organic', 'portal', 'bookmark', 'directory', 'hypermedia',
      'wireframe', 'sitemap', 'materi', 'kuis', 'latihan', 'seo', 'meta',
    ];
    const isMateriQuery = materiKeywords.some((kw) => q.toLowerCase().includes(kw));

    if (isMateriQuery) {
      navigate(`/materi?search=${encodeURIComponent(q)}`);
    } else if (isLoggedIn) {
      navigate(`/pos?search=${encodeURIComponent(q)}`);
    } else {
      navigate(`/?search=${encodeURIComponent(q)}#katalog`);
    }
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home, show: true },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: isLoggedIn },
    { path: '/pos', label: 'Kasir POS', icon: ShoppingCart, show: true },
    { path: '/products', label: 'Produk', icon: Package, show: !isLoggedIn || isAdmin },
    { path: '/transactions', label: 'Laporan', icon: BarChart3, show: true },
    { path: '/materi', label: 'Materi Website', icon: BookOpen, show: true },
    { path: '/quiz', label: 'Kuis & Latihan', icon: HelpCircle, show: true },
    { path: '/#contact', label: 'Contact', icon: Phone, show: true, isHash: true },
  ];

  const handleNavClick = (link) => {
    setMobileOpen(false);
    if (link.isHash) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm no-print">
      {/* Top Info Bar — Domain Name & Company Tagline (tampil langsung tanpa scroll) */}
      <div className="bg-blue-900 text-blue-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe size={13} className="text-yellow-300" />
            <span className="font-mono text-white font-semibold">https://www.kasirpintar-pos.co.id</span>
            <span className="hidden sm:inline text-blue-300">|</span>
            <span className="hidden sm:inline">Solusi Point of Sale Modern &amp; Edukasi Web Bisnis UMKM</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-blue-200">
            <span>📞 (021) 1234-5678</span>
            <span>✉️ info@kasirpintar-pos.co.id</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo, Company Name & Short Description */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src="/logo.svg" alt="Kasir Pintar Logo" className="w-9 h-9" />
              <div>
                <span className="text-lg font-extrabold text-blue-700 leading-none block">Kasir Pintar POS</span>
                <span className="text-[11px] text-gray-500 leading-tight block">Sistem Kasir Digital Terpadu</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden xl:flex items-center gap-0.5">
              {navLinks.filter((l) => l.show).map((link) =>
                link.isHash ? (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link)}
                    className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <link.icon size={15} />
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <link.icon size={15} />
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Global Search Bar + User */}
            <div className="flex items-center gap-2.5">
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari produk / materi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-44 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                  />
                </div>
              </form>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[110px] truncate">
                      {user?.full_name}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-fade-in">
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
                          <p className="text-xs text-gray-500">@{user?.username} · {user?.role?.toUpperCase()}</p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            <User size={16} />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary flex items-center gap-1.5 text-sm !py-2 !px-3.5">
                  <LogIn size={15} />
                  Login
                </Link>
              )}

              {/* Mobile / Tablet menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Nav */}
          {mobileOpen && (
            <div className="xl:hidden border-t border-gray-200 py-3 animate-fade-in">
              <form onSubmit={handleSearch} className="mb-3 md:hidden">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari produk atau materi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </form>
              <div className="grid sm:grid-cols-2 gap-1">
                {navLinks.filter((l) => l.show).map((link) =>
                  link.isHash ? (
                    <button
                      key={link.path}
                      onClick={() => handleNavClick(link)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 text-left"
                    >
                      <link.icon size={18} />
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg ${
                        isActive(link.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

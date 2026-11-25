import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package, Tag, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const emptyProduct = {
  barcode: '',
  name: '',
  category_id: '',
  buy_price: '',
  sell_price: '',
  stock: '',
  image_url: '',
};

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: { limit: 200 } }),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch {
      toast.error('Gagal memuat data produk/kategori.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Product Handlers ---
  const openAddProduct = () => {
    setEditingProductId(null);
    setProductForm({ ...emptyProduct, category_id: categories[0]?.id || '' });
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      barcode: p.barcode,
      name: p.name,
      category_id: p.category_id,
      buy_price: p.buy_price,
      sell_price: p.sell_price,
      stock: p.stock,
      image_url: p.image_url || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        category_id: Number(productForm.category_id),
        buy_price: Number(productForm.buy_price || 0),
        sell_price: Number(productForm.sell_price),
        stock: Number(productForm.stock || 0),
      };

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        toast.success('Produk berhasil diperbarui!');
      } else {
        await api.post('/products', payload);
        toast.success('Produk berhasil ditambahkan!');
      }
      setShowProductModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan produk.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Hapus produk "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produk dihapus.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus produk.');
    }
  };

  // --- Category Handlers ---
  const openAddCategory = () => {
    setEditingCatId(null);
    setCatForm({ name: '', description: '' });
    setShowCatModal(true);
  };

  const openEditCategory = (c) => {
    setEditingCatId(c.id);
    setCatForm({ name: c.name, description: c.description || '' });
    setShowCatModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await api.put(`/categories/${editingCatId}`, catForm);
        toast.success('Kategori diperbarui!');
      } else {
        await api.post('/categories', catForm);
        toast.success('Kategori ditambahkan!');
      }
      setShowCatModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan kategori.');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori dihapus.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus kategori.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = filterCat === 'all' || String(p.category_id) === String(filterCat);
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manajemen Produk &amp; Kategori</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola katalog barang, harga beli/jual, stok, dan kategori toko</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            <Package size={16} />
            Produk ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            <Tag size={16} />
            Kategori ({categories.length})
          </button>
        </div>
      </div>

      {/* TAB: PRODUK */}
      {activeTab === 'products' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama produk atau barcode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="input-field sm:w-48"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button onClick={openAddProduct} className="btn-primary flex items-center justify-center gap-2 text-sm">
              <Plus size={16} />
              Tambah Produk
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Barcode</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-right">Harga Beli</th>
                  <th className="py-3 px-4 text-right">Harga Jual</th>
                  <th className="py-3 px-4 text-center">Stok</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.image_url || 'https://placehold.co/40x40/E5E7EB/9CA3AF?text=P'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <span className="font-semibold text-gray-800">{p.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{p.barcode}</td>
                    <td className="py-3 px-4">
                      <span className="badge bg-blue-50 text-blue-700">{p.category_name}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">
                      Rp {Number(p.buy_price).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-800">
                      Rp {Number(p.sell_price).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEditProduct(p)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: KATEGORI */}
      {activeTab === 'categories' && (
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">Daftar Kategori Produk</h2>
            <button onClick={openAddCategory} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} />
              Tambah Kategori
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-xl border border-gray-200 flex items-start justify-between bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-800">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.description || 'Tidak ada deskripsi'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditCategory(cat)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-100">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PRODUK */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowProductModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Kode / Barcode *</label>
                  <input
                    type="text"
                    required
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Kategori *</label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Harga Beli</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.buy_price}
                    onChange={(e) => setProductForm({ ...productForm, buy_price: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Harga Jual *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.sell_price}
                    onChange={(e) => setProductForm({ ...productForm, sell_price: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Stok *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">URL Gambar (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary text-sm">
                  Batal
                </button>
                <button type="submit" className="btn-primary text-sm">
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCatModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCatId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={() => setShowCatModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Deskripsi</label>
                <textarea
                  rows="2"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowCatModal(false)} className="btn-secondary text-sm">
                  Batal
                </button>
                <button type="submit" className="btn-primary text-sm">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import Receipt from '../components/pos/Receipt';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ScanBarcode } from 'lucide-react';

const CART_STORAGE_KEY = 'kasir_pintar_cart';

const POSPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // LocalStorage persistence untuk keranjang belanja agar tidak hilang saat refresh
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [paidAmount, setPaidAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchProductsAndCategories = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: { limit: 200 } }),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat produk.');
    }
  }, []);

  useEffect(() => {
    fetchProductsAndCategories();
  }, [fetchProductsAndCategories]);

  // Tambah produk ke keranjang
  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error(`Stok "${product.name}" habis!`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          toast.error(`Maksimal stok "${product.name}" adalah ${product.stock}`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Scan barcode instan saat user mengetik barcode persis atau menekan Enter
  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const exactMatch = products.find(
        (p) => p.barcode.toLowerCase() === search.trim().toLowerCase()
      );
      if (exactMatch) {
        handleAddToCart(exactMatch);
        toast.success(`+1 ${exactMatch.name}`);
        setSearch('');
      }
    }
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (newQty > item.stock) {
            toast.error(`Stok tersedia hanya ${item.stock}`);
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setPaidAmount('');
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Proses transaksi & kurangi stok DB
  const handleProcessTransaction = async () => {
    if (cartItems.length === 0) return;

    setProcessing(true);
    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
        paid_amount: Number(paidAmount),
      };

      const res = await api.post('/transactions', payload);
      toast.success('Transaksi berhasil disimpan!');
      setReceiptData(res.data.data);

      // Kosongkan keranjang & refresh stok produk
      handleClearCart();
      fetchProductsAndCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memproses transaksi.');
    } finally {
      setProcessing(false);
    }
  };

  // Filter produk di client untuk pencarian instan
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || String(p.category_id) === String(selectedCategory);
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-4 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 no-print">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Kasir POS (Split-Screen Desktop)</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <ScanBarcode size={14} className="text-blue-600" />
            Tip: Ketik/scan barcode lalu tekan <strong>Enter</strong> untuk langsung tambah ke keranjang. Keranjang tersimpan otomatis.
          </p>
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-195px)] min-h-[580px] no-print">
        {/* KIRI: Daftar Produk */}
        <div
          className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col overflow-hidden"
          onKeyDown={handleBarcodeKeyDown}
        >
          <ProductGrid
            products={filteredProducts}
            categories={categories}
            search={search}
            setSearch={setSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* KANAN: Keranjang Belanja */}
        <div className="lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
          <Cart
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
            onProcessTransaction={handleProcessTransaction}
            processing={processing}
          />
        </div>
      </div>

      {/* Modal Struk Thermal */}
      {receiptData && (
        <Receipt
          transaction={receiptData}
          onClose={() => setReceiptData(null)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default POSPage;

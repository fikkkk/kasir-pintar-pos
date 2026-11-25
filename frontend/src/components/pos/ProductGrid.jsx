import { Search, Filter, Package } from 'lucide-react';

const ProductGrid = ({ products, categories, search, setSearch, selectedCategory, setSelectedCategory, onAddToCart }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama produk atau scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            autoFocus
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field pl-9 pr-8 min-w-[160px] appearance-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Package size={48} className="mb-3" />
            <p className="text-base font-medium">Produk tidak ditemukan</p>
            <p className="text-sm">Coba ubah kata kunci atau filter kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onAddToCart(product)}
                disabled={product.stock <= 0}
                className={`group text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                  product.stock <= 0
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md active:scale-[0.98] cursor-pointer'
                }`}
              >
                <div className="relative mb-2">
                  <img
                    src={product.image_url || `https://placehold.co/200x200/E5E7EB/9CA3AF?text=${encodeURIComponent(product.name.substring(0, 8))}`}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-lg bg-gray-100"
                    loading="lazy"
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-1 right-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      Sisa {product.stock}
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      Habis
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-mono">{product.barcode}</p>
                <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5 line-clamp-2">{product.name}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  Rp {Number(product.sell_price).toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Stok: {product.stock}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;

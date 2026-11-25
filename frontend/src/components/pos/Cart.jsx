import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';

const Cart = ({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  paidAmount,
  setPaidAmount,
  onProcessTransaction,
  processing,
}) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.sell_price * item.qty, 0);
  const changeAmount = paidAmount ? Math.max(0, Number(paidAmount) - totalAmount) : 0;
  const isPaymentEnough = Number(paidAmount) >= totalAmount;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={20} className="text-blue-600" />
          Keranjang
          {cartItems.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </h2>
        {cartItems.length > 0 && (
          <button onClick={onClearCart} className="text-xs text-red-500 hover:text-red-700 font-medium">
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <ShoppingCart size={40} className="mb-2" />
            <p className="text-sm font-medium">Keranjang kosong</p>
            <p className="text-xs">Klik produk untuk menambahkan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl animate-fade-in">
                <img
                  src={item.image_url || `https://placehold.co/48x48/E5E7EB/9CA3AF?text=P`}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Rp {Number(item.sell_price).toLocaleString('id-ID')} × {item.qty}
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    Rp {(item.sell_price * item.qty).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onUpdateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    disabled={item.qty >= item.stock}
                    className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="w-7 h-7 rounded-lg hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — Total, Bayar, Kembalian */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-3 bg-gray-50 rounded-b-xl">
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total ({cartItems.reduce((s, i) => s + i.qty, 0)} item)</span>
            <span className="text-xl font-extrabold text-gray-900">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Input Bayar */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Uang Bayar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="input-field pl-10 text-lg font-bold"
                min="0"
              />
            </div>
            {/* Quick amount buttons */}
            <div className="flex gap-1.5 mt-2">
              {[totalAmount, Math.ceil(totalAmount / 10000) * 10000, Math.ceil(totalAmount / 50000) * 50000, 100000].filter((v, i, a) => a.indexOf(v) === i && v >= totalAmount).slice(0, 4).map((amount) => (
                <button
                  key={amount}
                  onClick={() => setPaidAmount(String(amount))}
                  className="flex-1 text-xs py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                  {(amount / 1000).toFixed(0)}K
                </button>
              ))}
            </div>
          </div>

          {/* Kembalian */}
          {paidAmount && (
            <div className={`flex justify-between items-center p-2.5 rounded-xl ${isPaymentEnough ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <span className={`text-sm font-medium ${isPaymentEnough ? 'text-emerald-700' : 'text-red-700'}`}>
                {isPaymentEnough ? 'Kembalian' : 'Kurang'}
              </span>
              <span className={`text-lg font-extrabold ${isPaymentEnough ? 'text-emerald-700' : 'text-red-700'}`}>
                Rp {isPaymentEnough ? changeAmount.toLocaleString('id-ID') : (totalAmount - Number(paidAmount)).toLocaleString('id-ID')}
              </span>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={onProcessTransaction}
            disabled={!isPaymentEnough || processing || cartItems.length === 0}
            className="w-full btn-success !py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard size={20} />
            {processing ? 'Memproses...' : 'Proses & Cetak Struk'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

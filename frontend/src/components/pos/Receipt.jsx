import { Printer, X } from 'lucide-react';

const Receipt = ({ transaction, onClose, onPrint }) => {
  if (!transaction) return null;

  const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;
  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Receipt Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10 animate-fade-in">
        {/* Controls (no-print) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 no-print">
          <h3 className="font-bold text-gray-800">Struk Transaksi</h3>
          <div className="flex items-center gap-2">
            <button onClick={onPrint} className="btn-primary text-sm flex items-center gap-1.5 !py-2">
              <Printer size={16} />
              Cetak Struk
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div id="receipt-print" className="p-6 font-mono text-sm">
          {/* Header */}
          <div className="receipt-header text-center mb-4">
            <p className="receipt-store-name text-lg font-bold">KASIR PINTAR POS</p>
            <p className="text-xs text-gray-500">Jl. Teknologi No. 42, Jakarta Selatan</p>
            <p className="text-xs text-gray-500">Telp: (021) 1234-5678</p>
            <p className="text-xs text-gray-500">www.kasirpintar-pos.co.id</p>
          </div>

          <div className="receipt-divider border-t border-dashed border-gray-400 my-3" />

          {/* Transaction Info */}
          <div className="text-xs space-y-0.5 mb-3">
            <div className="flex justify-between">
              <span>No. Invoice</span>
              <span className="font-bold">{transaction.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal</span>
              <span>{formatDate(transaction.transaction_date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir</span>
              <span>{transaction.cashier}</span>
            </div>
          </div>

          <div className="receipt-divider border-t border-dashed border-gray-400 my-3" />

          {/* Items */}
          <table className="w-full text-xs">
            <tbody>
              {transaction.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1" colSpan="2">
                    <div>{item.product_name}</div>
                    <div className="flex justify-between text-gray-500">
                      <span>{item.quantity} x {formatCurrency(item.unit_price)}</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(item.subtotal)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-divider border-t border-dashed border-gray-400 my-3" />

          {/* Totals */}
          <div className="receipt-total space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-bold">TOTAL</span>
              <span className="font-bold">{formatCurrency(transaction.total_amount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Bayar</span>
              <span>{formatCurrency(transaction.paid_amount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Kembalian</span>
              <span>{formatCurrency(transaction.change_amount)}</span>
            </div>
          </div>

          <div className="receipt-divider border-t border-dashed border-gray-400 my-3" />

          {/* Footer */}
          <div className="receipt-footer text-center text-xs text-gray-500 mt-4">
            <p className="font-semibold">Terima kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat</p>
            <p>ditukar atau dikembalikan.</p>
            <p className="mt-2">— Kasir Pintar POS —</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;

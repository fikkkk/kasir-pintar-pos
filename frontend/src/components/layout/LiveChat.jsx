import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const autoReplies = [
  'Halo! Selamat datang di Kasir Pintar POS. Ada yang bisa kami bantu? 😊',
  'Tentu! Untuk mulai menggunakan kasir, silakan login dengan akun Anda terlebih dahulu.',
  'Anda bisa menambah produk melalui menu "Produk" setelah login sebagai Admin.',
  'Untuk mencetak struk, klik tombol "Proses & Cetak Struk" setelah transaksi selesai.',
  'Jika ada kendala lain, silakan hubungi kami di info@kasirpintar-pos.co.id. Terima kasih! 🙏',
];

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo! 👋 Ada yang bisa kami bantu hari ini?', sender: 'bot', time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [replyIndex, setReplyIndex] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Auto reply after delay
    setTimeout(() => {
      const reply = autoReplies[replyIndex % autoReplies.length];
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot', time: new Date() }]);
      setReplyIndex((prev) => prev + 1);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 no-print">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-fade-in overflow-hidden"
          style={{ height: '450px' }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Live Chat Support</p>
                <p className="text-[11px] text-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-1.5 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    {msg.sender === 'user' ? <User size={12} className="text-white" /> : <Bot size={12} className="text-gray-600" />}
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gray-700 hover:bg-gray-800 rotate-0' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
        }`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>
    </div>
  );
};

export default LiveChat;

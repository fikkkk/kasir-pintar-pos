import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LiveChat from './components/layout/LiveChat';
import NewsletterPopup from './components/layout/NewsletterPopup';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import ProductPage from './pages/ProductPage';
import TransactionPage from './pages/TransactionPage';
import MateriPage from './pages/MateriPage';
import QuizPage from './pages/QuizPage';

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/pos" replace />;
  return children;
};

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute adminOnly><ProductPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionPage /></ProtectedRoute>} />

          {/* Public educational pages */}
          <Route path="/materi" element={<MateriPage />} />
          <Route path="/quiz" element={<QuizPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <LiveChat />
      <NewsletterPopup />
    </div>
  );
}

export default App;

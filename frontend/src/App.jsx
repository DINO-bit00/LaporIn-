import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LaporPage from './pages/LaporPage';
import FeedPage from './pages/FeedPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lapor" element={<LaporPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

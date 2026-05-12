import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login } from '../services/auth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password tidak boleh kosong');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin <span className="gradient-text">Panel</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Masukkan password admin untuk melanjutkan</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Masukkan password admin"
                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500
                  transition-all duration-200"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-white font-bold py-3 rounded-xl text-sm
              hover:opacity-90 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Masuk <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Hanya admin yang memiliki akses ke panel ini.
        </p>
      </div>
    </div>
  );
}

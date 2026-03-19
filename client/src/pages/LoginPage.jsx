import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from '../components/UI/Spinner.jsx';
import lfiLogo from '../assets/lfi.png';
import { supabase } from '../utils/supabaseClient.js';

export default function LoginPage() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [view,     setView]     = useState('login'); // 'login' | 'forgot' | 'forgot-sent'

  const ALLOWED_DOMAINS = ['lfi.la', 'lafabricaimaginaria.com'];

  function isAllowedEmail(addr) {
    const domain = addr.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isAllowedEmail(email)) {
      setError('Acceso restringido. Solo se permiten cuentas corporativas (@lfi.la, @lafabricaimaginaria.com).');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await api.login({ email, password });
      login(token, user);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / título */}
        <div className="text-center mb-8">
          <img src={lfiLogo} alt="LFi" className="w-16 h-16 rounded-2xl mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-[#e8eaf0] tracking-tight">MyBoardLFi</h1>
          <p className="text-sm text-[#555b70] mt-1">Plataforma de gestión para LFi</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-[#1a1d26] border border-[#2a2d3a] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8b92a5] mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="tu@lfi.la"
              className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3 py-2.5
                         text-[#e8eaf0] text-sm placeholder-[#3a3f50]
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                         transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8b92a5] mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3 py-2.5
                         text-[#e8eaf0] text-sm placeholder-[#3a3f50]
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                         transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-medium text-sm rounded-lg px-4 py-2.5
                       transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size={4} /> : 'Iniciar sesión'}
          </button>
        </form>

        {view === 'login' && (
          <button
            onClick={() => { setView('forgot'); setError(''); }}
            className="block text-center text-xs text-[#555b70] hover:text-indigo-400 mt-4 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {view === 'forgot' && (
          <ForgotPassword
            initialEmail={email}
            onBack={() => { setView('login'); setError(''); }}
          />
        )}

        {view === 'forgot-sent' && (
          <p className="text-center text-sm text-green-400 mt-4">
            Revisa tu correo — te hemos enviado un enlace para restablecer tu contraseña.
          </p>
        )}

        <p className="text-center text-xs text-[#3a3f50] mt-6">
          MyBoardLFi · © 2026 Ibai Fernández
        </p>
      </div>
    </div>
  );
}

// ── Subcomponente: formulario de recuperación ─────────────────────────────────
function ForgotPassword({ initialEmail, onBack }) {
  const [email,   setEmail]   = useState(initialEmail || '');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const ALLOWED_DOMAINS = ['lfi.la', 'lafabricaimaginaria.com'];
  const isAllowed = (addr) => ALLOWED_DOMAINS.includes(addr.split('@')[1]?.toLowerCase());

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isAllowed(email)) {
      setError('Solo se permiten cuentas corporativas (@lfi.la, @lafabricaimaginaria.com).');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  if (sent) return (
    <div className="bg-[#1a1d26] border border-[#2a2d3a] rounded-2xl p-6 text-center space-y-3 mt-[-1rem]">
      <p className="text-green-400 text-sm">✅ Revisa tu correo corporativo.</p>
      <p className="text-[#555b70] text-xs">
        Hemos enviado un enlace a <strong className="text-[#8b92a5]">{email}</strong>.
        Expira en 1 hora.
      </p>
      <button onClick={onBack} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
        Volver al login
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1d26] border border-[#2a2d3a] rounded-2xl p-6 space-y-4 mt-[-1rem]">
      <p className="text-[#8b92a5] text-sm">
        Introduce tu email corporativo y te enviaremos un enlace para restablecer tu contraseña.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
        placeholder="tu@lfi.la"
        className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3 py-2.5
                   text-[#e8eaf0] text-sm placeholder-[#3a3f50]
                   focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                   text-white font-medium text-sm rounded-lg px-4 py-2.5
                   transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Spinner size={4} /> : 'Enviar enlace'}
      </button>
      <button type="button" onClick={onBack} className="w-full text-xs text-[#555b70] hover:text-[#8b92a5] transition-colors">
        Volver al login
      </button>
    </form>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient.js';
import { Spinner } from '../components/UI/Spinner.jsx';
import lfiLogo from '../assets/lfi.png';

export default function ResetPasswordPage({ onDone }) {
  const [password,  setPassword]  = useState('');
  const [password2, setPassword2] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [done,      setDone]      = useState(false);
  const [ready,     setReady]     = useState(false);

  // Supabase puts the recovery token in the URL hash — exchange it for a session
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => onDone?.(), 2500);
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={lfiLogo} alt="LFi" className="w-16 h-16 rounded-2xl mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-[#e8eaf0] tracking-tight">Nueva contraseña</h1>
          <p className="text-sm text-[#555b70] mt-1">MyBoardLFi</p>
        </div>

        {done ? (
          <div className="bg-[#1a1d26] border border-[#2a2d3a] rounded-2xl p-6 text-center">
            <p className="text-green-400 text-sm">✅ Contraseña actualizada correctamente.</p>
            <p className="text-[#555b70] text-xs mt-2">Redirigiendo al login…</p>
          </div>
        ) : !ready ? (
          <div className="bg-[#1a1d26] border border-[#2a2d3a] rounded-2xl p-6 text-center">
            <Spinner size={6} />
            <p className="text-[#555b70] text-sm mt-3">Verificando enlace…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#1a1d26] border border-[#2a2d3a] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8b92a5] mb-1.5 uppercase tracking-wider">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3 py-2.5
                           text-[#e8eaf0] text-sm placeholder-[#3a3f50]
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8b92a5] mb-1.5 uppercase tracking-wider">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-3 py-2.5
                           text-[#e8eaf0] text-sm placeholder-[#3a3f50]
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                         text-white font-medium text-sm rounded-lg px-4 py-2.5
                         transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size={4} /> : 'Guardar contraseña'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-[#3a3f50] mt-6">
          MyBoardLFi · © 2026 Ibai Fernández
        </p>
      </div>
    </div>
  );
}

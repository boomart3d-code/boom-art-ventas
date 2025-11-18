import React, { useState } from 'react';
import { User as UserIcon, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const AUTHORIZED_USERS = [
  { email: 'admin@boomart.com', pin: '1234', name: 'Administrador' },
  { email: 'ventas@boomart.com', pin: '0000', name: 'Vendedor' }
];

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AUTHORIZED_USERS.find(u => u.email === email && u.pin === pin);
    
    if (user) {
      onLogin({ email: user.email, name: user.name });
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">BA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Boom Art Sales</h1>
          <p className="text-slate-500 text-sm mt-1">Ingreso autorizado</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg flex items-center gap-2 border border-rose-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-slate-400" />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              >
                <option value="">Seleccionar usuario</option>
                {AUTHORIZED_USERS.map(u => (
                  <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PIN de Acceso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="••••"
                maxLength={4}
                required
              />
            </div>
             <p className="text-xs text-slate-400 mt-2 text-right">
               Hint: admin (1234) / ventas (0000)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <span>Ingresar</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { X, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

type PublicRole = 'creator' | 'brand' | 'admin';
type AuthUser = { id: string; email: string; displayName: string; role: PublicRole };

interface AccountAccessModalProps {
  requestedRole: PublicRole;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

export default function AccountAccessModal({ requestedRole, onClose, onAuthenticated }: AccountAccessModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(requestedRole === 'admin' ? 'login' : 'register');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Exclude<PublicRole, 'admin'>>(requestedRole === 'admin' ? 'creator' : requestedRole);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mode === 'register'
          ? { displayName: displayName.trim(), email: email.trim(), password, role }
          : { email: email.trim(), password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.user) throw new Error(result?.error || 'Não foi possível entrar. Verifique os dados e tente novamente.');
      if (result.user.role !== requestedRole) {
        throw new Error(`Esta conta é de ${result.user.role === 'creator' ? 'criador' : result.user.role === 'brand' ? 'marca/cliente' : 'admin'}. Termine sessão e entre com a conta correcta.`);
      }
      onAuthenticated(result.user as AuthUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'O serviço de contas não está disponível neste momento.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-neutral-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="account-access-title">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Fechar janela" />
      <div className="relative my-6 w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
        <button onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5" /></button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#52c1b9]/10 text-[#258b84]"><ShieldCheck className="h-6 w-6" /></div>
        <h2 id="account-access-title" className="mt-5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">{mode === 'register' ? 'Crie a sua conta' : 'Bem-vindo de volta'}</h2>
        <p className="mt-2 pr-5 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{requestedRole === 'admin' ? 'Acesso reservado à equipa autorizada.' : requestedRole === 'creator' ? 'Entre no seu espaço para gerir perfil, portfólio e materiais.' : 'Entre para publicar oportunidades, comprar materiais e acompanhar facturas.'}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Nome de apresentação
                <input required minLength={2} autoComplete="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="O seu nome ou marca" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#52c1b9] focus:ring-2 focus:ring-[#52c1b9]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
              </label>
              {requestedRole !== 'admin' && (
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Tipo de conta
                  <select value={role} onChange={(e) => setRole(e.target.value as 'creator' | 'brand')} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#52c1b9] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                    <option value="creator">Criador / Influenciador / Prestador</option>
                    <option value="brand">Marca / Cliente</option>
                  </select>
                </label>
              )}
            </>
          )}
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">E-mail
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@exemplo.com" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#52c1b9] focus:ring-2 focus:ring-[#52c1b9]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </label>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Palavra-passe
            <span className="relative mt-1.5 block">
              <input required minLength={mode === 'register' ? 10 : 1} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Mínimo de 10 caracteres' : 'A sua palavra-passe'} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#52c1b9] focus:ring-2 focus:ring-[#52c1b9]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
              <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"><>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</></button>
            </span>
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
          <button disabled={busy} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#52c1b9] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#2b9d96] disabled:cursor-wait disabled:opacity-60">{busy ? 'A processar…' : mode === 'register' ? 'Criar conta' : 'Entrar'} <ArrowRight className="h-4 w-4" /></button>
        </form>

        {requestedRole !== 'admin' && (
          <p className="mt-5 text-center text-sm text-neutral-500">{mode === 'register' ? 'Já tem conta?' : 'Ainda não tem conta?'} <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }} className="font-bold text-[#258b84] hover:underline">{mode === 'register' ? 'Entrar' : 'Criar conta'}</button></p>
        )}
        <p className="mt-4 text-center text-[10px] leading-4 text-neutral-400">As contas são protegidas pelo servidor. O acesso de administrador não pode ser criado por registo público.</p>
      </div>
    </div>
  );
}

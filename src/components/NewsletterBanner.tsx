import React, { useState } from 'react';
import { Mail, ArrowRight, BookOpen, Send } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'revista-nobre-creators' }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !(result?.ok || result?.success)) {
        throw new Error('Newsletter endpoint unavailable');
      }
      setSubmitted(true);
      setEmail('');
    } catch {
      setError('A subscrição ainda não foi concluída. O serviço de subscrição da revista precisa de ser ligado.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="radar" className="section-newsletter py-12 sm:py-16">
      <div className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-[32px] border border-neutral-200/70 bg-neutral-100/70 px-6 py-9 transition-colors dark:border-neutral-800 dark:bg-neutral-900/60 sm:px-10 sm:py-12 lg:flex-row lg:px-14">
        <div className="relative z-10 w-full max-w-xl text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#258b84] dark:bg-neutral-800"><BookOpen className="h-4 w-4" /> Revista Nobre Creators</span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">Receba a revista e as novidades da rede.</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:text-base">Edições, ideias criativas, tendências de conteúdo, oportunidades e dicas para marcas e criadores — directamente no seu e-mail.</p>

          {submitted ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">Subscrição confirmada. Obrigado por se juntar à Nobre Creators.</div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md items-center gap-2">
              <label className="sr-only" htmlFor="newsletter-email">O seu e-mail</label>
              <input id="newsletter-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="O seu e-mail" className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-5 py-3.5 text-sm text-neutral-900 shadow-sm outline-none focus:ring-2 focus:ring-[#52c1b9] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
              <button type="submit" disabled={submitting} aria-label="Subscrever revista" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-[#2b9d96] disabled:opacity-60 dark:bg-white dark:text-neutral-950"><Send className="h-4 w-4" /></button>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-xs leading-5 text-red-600 dark:text-red-400">{error}</p>}
          <p className="mt-3 text-[11px] text-neutral-400">Pode cancelar a subscrição a qualquer momento.</p>
        </div>

        <div className="relative flex min-h-[220px] w-full max-w-sm items-center justify-center lg:w-1/2">
          <div className="absolute h-56 w-56 rounded-full bg-[#52c1b9]/10" />
          <div className="relative w-64 rotate-[-3deg] rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl transition duration-500 hover:rotate-0 dark:border-neutral-700 dark:bg-neutral-950">
            <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#52c1b9]/10 text-[#258b84]"><Mail className="h-5 w-5" /></span><span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Edição digital</span></div>
            <p className="mt-5 text-lg font-extrabold leading-tight text-neutral-950 dark:text-white">Nobre Creators</p>
            <p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Histórias, talento, campanhas e ideias para dar vida às marcas.</p>
            <div className="mt-5 border-t border-neutral-100 pt-3 text-[10px] font-semibold text-[#258b84] dark:border-neutral-800">CRIATIVIDADE • CONTEÚDO • CRESCIMENTO</div>
          </div>
        </div>
      </div>
    </section>
  );
}

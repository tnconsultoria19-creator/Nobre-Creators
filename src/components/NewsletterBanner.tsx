import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="section-newsletter py-16">
      <div className="relative rounded-[40px] bg-neutral-100/70 dark:bg-neutral-800/20 overflow-hidden px-6 py-12 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 transition-colors">
        
        {/* Left column Content & Sign-up Form */}
        <div className="max-w-xl text-left space-y-6 lg:w-1/2 relative z-10">
          <span className="inline-flex items-center gap-x-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" /> ACTUALIZAÇÕES KWANZAA NORTH
          </span>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight">
              Receba o Radar Kwanzaa North
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Receba novidades sobre construção, manutenção, procurement, oportunidades de projecto e boas práticas técnicas em Angola. Sem spam; pode cancelar a subscrição quando quiser.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
              Obrigado por subscrever! Irá receber novidades brevemente.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="O seu melhor e-mail"
                className="w-full pl-5 pr-14 py-4 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:text-white shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 p-3 rounded-full bg-neutral-950 hover:bg-emerald-500 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-md"
                aria-label="Subscrever"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-[11px] text-neutral-400 flex items-center gap-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>Ao registar-se, aceita os nossos Termos de Serviço e Política de Privacidade.</span>
          </div>
        </div>

        {/* Right column: Graphic illustration of features */}
        <div className="lg:w-1/2 flex items-center justify-center relative z-10 w-full">
          <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 rounded-full flex items-center justify-center border border-emerald-500/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl w-72 text-left space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Radar Kwanzaa North</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">Guias práticos para planear obras, definir escopos, comparar propostas e escolher materiais com mais confiança.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Actualização informativa</span>
              </div>
            </div>
            
            {/* Ambient background circles */}
            <div className="absolute top-10 right-10 w-8 h-8 rounded-full bg-emerald-400/40 blur-sm"></div>
            <div className="absolute bottom-10 left-10 w-12 h-12 rounded-full bg-indigo-400/30 blur-sm"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

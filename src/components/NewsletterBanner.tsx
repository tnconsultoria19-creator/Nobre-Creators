import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deliveryNotice, setDeliveryNotice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'revista-nobre-creators' }),
      });
      const result = await response.json().catch(() => null);
      if (result?.subscribed) {
        setSubmitted(true);
        setEmail('');
        setDeliveryNotice(result.deliverySent
          ? 'A sua subscrição está confirmada e a edição digital foi enviada para o seu e-mail.'
          : 'O seu e-mail foi registado. O envio automático da revista será activado assim que a entrega por e-mail estiver configurada.');
        return;
      }
      if (!response.ok || !(result?.ok || result?.success)) {
        throw new Error('Newsletter backend did not confirm the subscription.');
      }
      setSubmitted(true);
      setEmail('');
      setDeliveryNotice('Subscrição confirmada. Obrigado por se juntar à Nobre Creators.');
    } catch {
      setError('A subscrição ainda não está disponível. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-newsletter py-16">
      <div className="relative rounded-[40px] bg-neutral-100/70 dark:bg-neutral-800/20 overflow-hidden px-6 py-12 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 transition-colors">
        
        {/* Left column Content & Sign-up Form */}
        <div className="max-w-xl text-left space-y-6 lg:w-1/2 relative z-10">
          <span className="inline-flex items-center gap-x-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" /> REVISTA NOBRE CREATORS
          </span>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight">
              Receba a revista Nobre Creators
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Receba a nossa revista digital, ideias criativas, tendências, oportunidades e novidades para marcas e criadores directamente no seu e-mail.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
              {deliveryNotice || 'Subscrição confirmada. Obrigado por se juntar à Nobre Creators.'}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-md">
              <input
                type="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="O seu melhor e-mail"
                className="w-full pl-5 pr-14 py-4 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:text-white shadow-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute right-2 p-3 rounded-full bg-neutral-950 hover:bg-emerald-500 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-md"
                aria-label="Subscrever"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}
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
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Revista Nobre Creators</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">Conteúdo sobre criação, redes sociais, produção, publicidade e oportunidades para a comunidade.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Edição digital</span>
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

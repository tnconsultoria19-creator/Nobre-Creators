import React from 'react';
import { ArrowRight, Megaphone, Target, BarChart3, MousePointerClick } from 'lucide-react';

export default function BecomeAuthorBanner() {
  return (
    <section id="publicidade" className="py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-[32px] bg-neutral-950 px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#52c1b9]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8fe4dd]"><Megaphone className="h-4 w-4" /> Publicidade</span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Faça a sua marca chegar mais longe.</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-300 sm:text-base">Criamos campanhas de publicidade paga nas redes sociais, com públicos bem definidos, criativos relevantes e acompanhamento para optimizar o investimento.</p>
            <a href="#servicos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#52c1b9] px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-white">Explorar publicidade paga <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div><p className="text-xs font-semibold text-neutral-300">Campanha digital</p><p className="mt-1 text-lg font-bold text-white">Planeada para a sua marca</p></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#52c1b9]/15 text-[#8fe4dd]"><Target className="h-5 w-5" /></span>
            </div>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8fe4dd]"><Target className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Público certo</p><p className="mt-1 text-xs leading-5 text-neutral-400">Segmentação por objectivos e audiência.</p></div></div>
              <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8fe4dd]"><MousePointerClick className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Criativos que comunicam</p><p className="mt-1 text-xs leading-5 text-neutral-400">Anúncios alinhados com a mensagem da marca.</p></div></div>
              <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8fe4dd]"><BarChart3 className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Acompanhamento de resultados</p><p className="mt-1 text-xs leading-5 text-neutral-400">Leitura de desempenho e optimização contínua.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

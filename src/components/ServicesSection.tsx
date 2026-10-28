import React from 'react';
import { ArrowUpRight, Mic2, Share2, MonitorSmartphone, Megaphone } from 'lucide-react';

interface ServicesSectionProps {
  onRequestService?: (service: string) => void;
}

const services = [
  { icon: Mic2, number: '01', title: 'Estúdio & Produção', description: 'Gravação e produção de podcasts, entrevistas, vídeos e cobertura de eventos.', details: 'Podcasts · Eventos · Vídeo' },
  { icon: Share2, number: '02', title: 'Gestão de Redes Sociais', description: 'Planeamento de conteúdo, criação, publicação e gestão consistente das suas redes.', details: 'Estratégia · Conteúdo · Comunidade' },
  { icon: MonitorSmartphone, number: '03', title: 'Websites & Presença Digital', description: 'Websites profissionais e páginas de campanha para tornar a sua marca fácil de encontrar.', details: 'Websites · Landing pages · Presença online' },
  { icon: Megaphone, number: '04', title: 'Publicidade Paga', description: 'Campanhas de anúncios nas redes sociais para alcançar as pessoas certas e medir resultados.', details: 'Anúncios · Segmentação · Optimização' },
];

export default function ServicesSection({ onRequestService }: ServicesSectionProps) {
  return (
    <section id="servicos" className="py-12 sm:py-16">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2b9d96]">O que fazemos</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Serviços para fazer a sua marca crescer</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base dark:text-neutral-400">Da produção de conteúdo à presença digital e à publicidade, reunimos tudo num só lugar.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.number} className="group flex min-h-[250px] flex-col rounded-3xl border border-neutral-200/80 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#52c1b9]/10 text-[#2b9d96]"><Icon className="h-5 w-5" /></span>
                <span className="text-xs font-bold tracking-widest text-neutral-300 dark:text-neutral-600">{service.number}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-neutral-950 dark:text-white">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{service.description}</p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{service.details}</p>
              <button onClick={() => onRequestService?.(service.title)} className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-neutral-900 transition hover:text-[#2b9d96] dark:text-white">
                Solicitar serviço <ArrowUpRight className="h-4 w-4" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

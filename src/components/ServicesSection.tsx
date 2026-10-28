import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Mic2, Share2, MonitorSmartphone, Megaphone, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onRequestService?: (service: string) => void;
}

const services = [
  { id: '01', icon: Mic2, title: 'Estúdio & Produção', description: 'Gravação de podcasts, entrevistas, vídeos e cobertura de eventos.', detail: 'Podcasts · Eventos · Vídeo', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=75&w=640&auto=format&fit=crop' },
  { id: '02', icon: Share2, title: 'Gestão de Redes Sociais', description: 'Planeamento, criação e gestão contínua de conteúdo para as suas redes.', detail: 'Estratégia · Conteúdo · Comunidade', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=75&w=640&auto=format&fit=crop' },
  { id: '03', icon: MonitorSmartphone, title: 'Websites & Presença Digital', description: 'Websites profissionais e páginas de campanha para a sua marca.', detail: 'Websites · Landing pages', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=75&w=640&auto=format&fit=crop' },
  { id: '04', icon: Megaphone, title: 'Publicidade Paga', description: 'Anúncios nas redes sociais com segmentação e acompanhamento de resultados.', detail: 'Anúncios · Alcance · Optimização', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=640&auto=format&fit=crop' },
];

export default function ServicesSection({ onRequestService }: ServicesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <section id="servicos" className="section-slider-new-categories relative py-12 sm:py-16">
      <div className="relative mb-8 flex items-end justify-between gap-4 sm:mb-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2b9d96]">O que fazemos</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Serviços Nobre Creators</h2>
          <p className="mt-3 max-w-3xl text-sm font-normal text-neutral-500 sm:text-base dark:text-neutral-400">Conteúdo, presença digital e campanhas para marcas que querem crescer.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => scroll('left')} aria-label="Serviço anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => scroll('right')} aria-label="Serviço seguinte" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.id} className="group flex min-w-[245px] max-w-[285px] snap-start flex-col rounded-3xl border border-neutral-100 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:min-w-[270px] sm:p-4">
              <div className="relative aspect-[5/3] w-full overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <img src={service.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-neutral-800 shadow-sm"><Icon className="h-3.5 w-3.5 text-[#258b84]" /> Serviço #{service.id}</span>
              </div>
              <div className="flex grow flex-col px-1 pb-1 pt-4">
                <h3 className="text-base font-bold text-neutral-950 dark:text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400">{service.description}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{service.detail}</p>
                <button onClick={() => onRequestService?.(service.title)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 transition hover:text-[#258b84] dark:text-white">Solicitar serviço <ArrowUpRight className="h-4 w-4" /></button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

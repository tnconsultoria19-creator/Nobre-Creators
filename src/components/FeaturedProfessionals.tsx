import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, ArrowUpRight } from 'lucide-react';
import { Author } from '../types';

interface FeaturedProfessionalsProps {
  authors: Author[];
  onSelectCreator?: (author: Author) => void;
}

export default function FeaturedProfessionals({ authors, onSelectCreator }: FeaturedProfessionalsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredAuthors = authors.filter((author) => author.featured !== false);
  const visibleAuthors = featuredAuthors.length ? featuredAuthors : authors;
  const activeAuthor = visibleAuthors[activeIndex % Math.max(visibleAuthors.length, 1)];

  useEffect(() => {
    if (visibleAuthors.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleAuthors.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [visibleAuthors.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [visibleAuthors.length]);

  if (!activeAuthor) return null;

  const showPrevious = () => setActiveIndex((current) => (current - 1 + visibleAuthors.length) % visibleAuthors.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % visibleAuthors.length);

  return (
    <section id="profissionais" className="py-10 sm:py-14 border-b border-neutral-100 dark:border-neutral-800" aria-label="Profissionais em destaque">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2b9d96]">Conheça a rede</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white">Talentos em destaque</h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-neutral-500 dark:text-neutral-400">Descubra criadores, profissionais e parceiros para o próximo projecto da sua marca.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={showPrevious} aria-label="Profissional anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={showNext} aria-label="Profissional seguinte" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div key={activeAuthor.id} className="grid overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-500 dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-[0.95fr_1.05fr] animate-[fadeIn_400ms_ease-out]">
        <button type="button" onClick={() => onSelectCreator?.(activeAuthor)} className="group relative min-h-[240px] overflow-hidden text-left md:min-h-[300px]">
          <img src={activeAuthor.cover} alt={activeAuthor.niche || activeAuthor.career} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-neutral-950/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Perfil em destaque</span>
        </button>
        <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
          <div className="flex items-center gap-4">
            <img src={activeAuthor.avatar} alt={activeAuthor.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-[#52c1b9]/30" />
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-lg font-bold text-neutral-950 dark:text-white">
                {activeAuthor.name}
                {activeAuthor.verified && <span className="rounded-full bg-[#52c1b9]/10 px-2 py-0.5 text-[10px] font-bold text-[#2b9d96]">Verificado</span>}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{activeAuthor.career}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{activeAuthor.bio || 'Explore o perfil, os serviços e os projectos deste membro da rede Nobre Creators.'}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
            {activeAuthor.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{activeAuthor.location}</span>}
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{activeAuthor.rating || 'Novo perfil'}</span>
            {activeAuthor.startingPrice && <span>Desde {activeAuthor.startingPrice}</span>}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <div className="flex gap-1.5" aria-label={`Perfil ${activeIndex + 1} de ${visibleAuthors.length}`}>
              {visibleAuthors.map((author, index) => (
                <button key={author.id} aria-label={`Ver perfil de ${author.name}`} onClick={() => setActiveIndex(index)} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-7 bg-[#52c1b9]' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'}`} />
              ))}
            </div>
            <button onClick={() => onSelectCreator?.(activeAuthor)} className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 transition hover:text-[#2b9d96] dark:text-white">
              Ver perfil <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

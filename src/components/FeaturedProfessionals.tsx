import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, ArrowUpRight } from 'lucide-react';
import { Author } from '../types';

interface FeaturedProfessionalsProps {
  authors: Author[];
  onSelectCreator?: (author: Author) => void;
}

export default function FeaturedProfessionals({ authors, onSelectCreator }: FeaturedProfessionalsProps) {
  const visibleAuthors = authors.filter((author) => author.featured !== false).length
    ? authors.filter((author) => author.featured !== false)
    : authors;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAuthor = visibleAuthors[activeIndex] || visibleAuthors[0];

  useEffect(() => {
    if (visibleAuthors.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleAuthors.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [visibleAuthors.length]);

  if (!activeAuthor) return null;

  const showPrevious = () => setActiveIndex((current) => (current - 1 + visibleAuthors.length) % visibleAuthors.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % visibleAuthors.length);

  return (
    <section id="profissionais" className="section-large-slider relative py-8 lg:py-12" aria-label="Profissionais em destaque">
      <div className="relative mb-8 flex flex-wrap items-end gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Conheça os nossos criadores</h2>
          <p className="mt-2.5 max-w-3xl text-sm font-normal text-neutral-500 sm:text-base dark:text-neutral-400">A cada momento, um novo talento da rede Nobre Creators. Explore os perfis e encontre a pessoa certa para a sua marca.</p>
        </div>
      </div>

      <div key={activeAuthor.id} className="relative flex min-h-[390px] flex-col-reverse justify-end md:flex-row">
        <div className="z-10 -mt-8 w-full px-3 sm:px-6 md:absolute md:left-0 md:top-1/2 md:mt-0 md:w-3/5 md:-translate-y-1/2 md:px-0 lg:w-1/2 xl:w-2/5 animate-[fadeIn_400ms_ease-out]">
          <div className="space-y-4 rounded-3xl border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur-xl transition-all dark:border-neutral-800 dark:bg-neutral-900/90 sm:space-y-5 sm:p-8 lg:px-9">
            <div className="flex flex-wrap items-center gap-2">
              {activeAuthor.niche && <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{activeAuthor.niche}</span>}
              {activeAuthor.verified && <span className="inline-flex items-center rounded-full bg-[#52c1b9]/10 px-2.5 py-1 text-xs font-bold text-[#258b84]">Perfil verificado</span>}
            </div>
            <button type="button" onClick={() => onSelectCreator?.(activeAuthor)} className="block text-left text-xl font-bold leading-snug text-neutral-950 transition hover:text-[#258b84] dark:text-white sm:text-2xl">
              {activeAuthor.name}
            </button>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{activeAuthor.career}</p>
            <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">{activeAuthor.bio || 'Conheça os serviços, a experiência e o portfólio deste membro da rede.'}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              {activeAuthor.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{activeAuthor.location}</span>}
              <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{activeAuthor.rating || 'Novo perfil'}</span>
              {activeAuthor.startingPrice && <span>Desde {activeAuthor.startingPrice}</span>}
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={showPrevious} aria-label="Profissional anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={showNext} aria-label="Profissional seguinte" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"><ChevronRight className="h-5 w-5" /></button>
                <span className="ml-2 text-[11px] text-neutral-400">{activeIndex + 1} / {visibleAuthors.length}</span>
              </div>
              <button type="button" onClick={() => onSelectCreator?.(activeAuthor)} className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 transition hover:text-[#258b84] dark:text-white">Ver perfil <ArrowUpRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="relative h-[290px] w-full overflow-hidden rounded-3xl shadow-lg sm:h-[360px] md:ml-auto md:h-[430px] md:w-[75%] lg:w-2/3">
          <img src={activeAuthor.cover} alt={activeAuthor.niche || activeAuthor.career} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <button type="button" onClick={() => onSelectCreator?.(activeAuthor)} className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-[#258b84]">
            Explorar perfil <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-1.5 md:justify-end md:pr-4">
        {visibleAuthors.map((author, index) => (
          <button key={author.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Ver ${author.name}`} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[#52c1b9]' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'}`} />
        ))}
      </div>
    </section>
  );
}

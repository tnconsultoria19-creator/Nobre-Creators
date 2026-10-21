import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { Author } from '../types';

interface NewestAuthorsProps {
  authors: Author[];
  onSelectCreator?: (creator: Author) => void;
}

export default function NewestAuthors({ authors, onSelectCreator }: NewestAuthorsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="section-slider-new-authors relative py-16 lg:py-20" id="directorio">
      {/* Background shape matching NextJS code template */}
      <div className="background-section absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 transform xl:max-w-[1340px] xl:rounded-[40px] bg-neutral-100/70 dark:bg-neutral-800/30 transition-colors"></div>

      <div className="relative z-10">
        <div className="relative mb-12 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
              Directório de Profissionais Kwanzaa North
            </h1>
            <h3 className="mt-3 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
              Navegue pelos perfis disponíveis, analise métricas e filtre por especialidade
            </h3>
          </div>
          
          <div className="relative flex items-center text-neutral-500 dark:text-neutral-400 gap-x-2">
            <button
              onClick={() => scroll('left')}
              className="flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-11 h-11 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Previous authors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-11 h-11 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Next authors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Authors list */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {authors.map((author) => (
            <button
              key={author.id}
              onClick={() => onSelectCreator && onSelectCreator(author)}
              className="card-author-box-2 group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 min-w-[240px] sm:min-w-[280px] snap-start shadow-sm hover:shadow-xl transition-all duration-300 text-left cursor-pointer"
            >
              {/* Cover Image */}
              <div className="relative shrink-0 h-32 overflow-hidden w-full">
                <img
                  src={author.cover}
                  alt={`${author.name} cover`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90"
                />
                <div className="absolute inset-x-3 top-3 flex">
                  <div className="flex items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Cachê: {author.startingPrice}
                  </div>
                </div>
              </div>

              {/* Avatar and Info */}
              <div className="mx-6 -mt-8 pb-7 text-center relative z-10 flex flex-col items-center">
                <div className="relative">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shadow-md"
                  />
                  {author.verified && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#52c1b9] text-white text-[9px] flex items-center justify-center rounded-full ring-2 ring-white">✓</span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <p className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-white transition-colors">
                    {author.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
                    {author.career}
                  </p>
                  <div className="flex items-center justify-center text-[11px] text-neutral-400 font-medium space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{author.location}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <span className="text-[10px] font-bold bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400 px-2 py-0.5 rounded-full">
                      {author.followers}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {author.rating}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

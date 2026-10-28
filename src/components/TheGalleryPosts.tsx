import React from 'react';
import { ArrowUpRight, Crown, Image as ImageIcon } from 'lucide-react';
import { Author } from '../types';

interface TheGalleryPostsProps {
  authors: Author[];
  onSelectCreator?: (author: Author) => void;
}

export default function TheGalleryPosts({ authors, onSelectCreator }: TheGalleryPostsProps) {
  const premiumAuthors = authors.filter((author) => author.premium).slice(0, 3);

  return (
    <section id="portfolio" className="border-t border-neutral-100 py-12 transition-colors dark:border-neutral-800 sm:py-16">
      <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2b9d96]">Vitrine Premium</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Portfólios em destaque</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base dark:text-neutral-400">Uma montra seleccionada para criadores e profissionais com perfil Premium activo.</p>
      </div>

      {premiumAuthors.length ? (
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {premiumAuthors.map((author) => (
            <article key={author.id} className="group overflow-hidden rounded-3xl border border-neutral-200/80 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <button type="button" onClick={() => onSelectCreator?.(author)} className="relative block aspect-[4/3] w-full overflow-hidden text-left">
                <img src={author.cover} alt={`Portfólio de ${author.name}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-neutral-950/75 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur"><Crown className="h-3.5 w-3.5 text-amber-300" /> Premium</span>
              </button>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <img src={author.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-neutral-950 dark:text-white">{author.name}</h3>
                    <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">{author.niche || author.career}</p>
                  </div>
                  <ImageIcon className="h-4 w-4 shrink-0 text-[#2b9d96]" />
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400">{author.bio || 'Explore o trabalho, a experiência e os serviços deste perfil Premium.'}</p>
                <button type="button" onClick={() => onSelectCreator?.(author)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 hover:text-[#2b9d96] dark:text-white">Explorar portfólio <ArrowUpRight className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700">
          <Crown className="mx-auto h-7 w-7 text-amber-400" />
          <p className="mt-3 font-semibold text-neutral-900 dark:text-white">Em breve: primeiros portfólios Premium</p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Os perfis com o recurso Premium activo poderão apresentar os seus projectos nesta montra.</p>
        </div>
      )}
    </section>
  );
}

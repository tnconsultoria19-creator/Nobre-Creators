import React, { useEffect, useState } from 'react';
import { CheckCircle, Crown, MapPin, Star, ArrowUpRight, Heart } from 'lucide-react';
import { Author } from '../types';

interface CreatorNetworkGridProps {
  authors: Author[];
  onSelectCreator?: (author: Author) => void;
}

export default function CreatorNetworkGrid({ authors, onSelectCreator }: CreatorNetworkGridProps) {
  const [liveCreators, setLiveCreators] = useState<Author[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/creators')
      .then(async (response) => response.ok ? response.json() : null)
      .then((result) => {
        if (cancelled || !Array.isArray(result?.creators) || result.creators.length === 0) return;
        const mapped: Author[] = result.creators.map((item: Record<string, unknown>, index: number) => {
          const avatarId = typeof item.avatar_asset_id === 'string' ? item.avatar_asset_id : '';
          const fallback = authors[index % Math.max(1, authors.length)];
          return {
            id: String(item.user_id || item.id || 'creator-' + index),
            name: String(item.display_name || 'Criador Nobre'),
            handle: String(item.handle || ''),
            career: String(item.career || 'Criador de conteúdo'),
            niche: String(item.niche || ''),
            bio: String(item.bio || ''),
            location: String(item.location || 'Angola'),
            avatar: avatarId ? '/api/assets/' + encodeURIComponent(avatarId) + '/preview' : '',
            cover: fallback?.cover || '',
            count: 0,
            followers: '',
            engagement: '',
            verified: false,
            premium: Number(item.premium_enabled) === 1,
            featured: true,
            rating: '',
          };
        });
        setLiveCreators(mapped);
      })
      .catch(() => { /* Sample profiles remain available before D1 is connected. */ });
    return () => { cancelled = true; };
  }, [authors]);

  const creators = (liveCreators.length ? liveCreators : authors).slice(0, 10);
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  return (
    <section id="criadores" className="section-top-authors border-t border-neutral-100 py-10 transition-colors dark:border-neutral-800 sm:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2b9d96]">A nossa comunidade</p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-white">Conheça os nossos criadores</h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-neutral-500 sm:text-sm dark:text-neutral-400">Perfis de criadores, influenciadores, produtores e especialistas criativos da rede Nobre Creators.</p>
        </div>
        <span className="text-xs font-medium text-neutral-400">{creators.length} perfis em destaque</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {creators.map((creator, index) => (
          <article key={creator.id} className="group relative min-w-0 rounded-2xl border border-neutral-100 bg-white px-3 pb-3 pt-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#52c1b9]/50 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:rounded-3xl sm:px-4 sm:pb-4 sm:pt-5">
            <span className="absolute left-2.5 top-2.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-100 px-1 text-[9px] font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">#{index + 1}</span>
            {creator.premium && <span className="absolute right-2.5 top-2.5 text-amber-500" title="Perfil Premium"><Crown className="h-3.5 w-3.5" /></span>}
            <button type="button" onClick={() => onSelectCreator?.(creator)} className="mx-auto flex w-full flex-col items-center">
              <div className="relative">
                {creator.avatar ? (
                  <img src={creator.avatar} alt={creator.name} loading="lazy" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = 'none'; }} className="h-14 w-14 rounded-full object-cover ring-2 ring-neutral-100 transition group-hover:ring-[#52c1b9]/40 dark:ring-neutral-800 sm:h-[66px] sm:w-[66px]" />
                ) : (
                  <span aria-label={creator.name} className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#52c1b9]/25 to-indigo-200 text-base font-black text-neutral-700 ring-2 ring-neutral-100 dark:from-[#52c1b9]/20 dark:to-neutral-700 dark:text-white dark:ring-neutral-800 sm:h-[66px] sm:w-[66px]">{creator.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                )}
                {creator.verified && <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#52c1b9] text-[8px] font-black text-white dark:border-neutral-900"><CheckCircle className="h-3 w-3" /></span>}
              </div>
              <h3 className="mt-2.5 w-full truncate text-[11px] font-bold text-neutral-950 dark:text-white sm:text-xs">{creator.name}</h3>
              <p className="mt-1 min-h-[28px] w-full line-clamp-2 text-[9px] leading-3.5 text-neutral-500 dark:text-neutral-400 sm:text-[10px]">{creator.niche || creator.career}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400"><MapPin className="h-3 w-3" />{creator.location || creator.province || 'Angola'}</span>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{creator.rating || 'Novo'}</span>
            </button>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2.5 dark:border-neutral-800">
              <button type="button" onClick={() => setFollowing((current) => ({ ...current, [creator.id]: !current[creator.id] }))} aria-label={following[creator.id] ? 'Deixar de seguir' : 'Seguir criador'} className={`inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[9px] font-bold transition ${following[creator.id] ? 'bg-[#52c1b9]/15 text-[#258b84]' : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}><Heart className={`h-3 w-3 ${following[creator.id] ? 'fill-current' : ''}`} />{following[creator.id] ? 'A seguir' : 'Seguir'}</button>
              <button type="button" onClick={() => onSelectCreator?.(creator)} aria-label={`Abrir perfil de ${creator.name}`} className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-[#52c1b9] hover:text-white dark:bg-neutral-800 dark:text-neutral-300"><ArrowUpRight className="h-3.5 w-3.5" /></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Crown, Image as ImageIcon, RefreshCw, Star } from 'lucide-react';
import { Author } from '../types';

type PremiumCreator = {
  id: string;
  user_id: string;
  handle: string;
  display_name: string;
  career?: string;
  niche?: string;
  bio?: string;
  location?: string;
  premium_enabled: number;
  premium_until?: string | null;
  avatar_asset_id?: string | null;
  portfolio_asset_id: string;
};

interface TheGalleryPostsProps {
  authors?: Author[];
  onSelectCreator?: (creator: Author) => void;
}

export default function TheGalleryPosts({ authors = [], onSelectCreator }: TheGalleryPostsProps) {
  const [creators, setCreators] = useState<PremiumCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/creators')
      .then(async (response) => {
        if (!response.ok) throw new Error('A vitrine Premium fica disponível depois de ligar a base de dados.');
        return response.json();
      })
      .then((result) => {
        if (cancelled) return;
        const items = Array.isArray(result?.creators) ? result.creators as PremiumCreator[] : [];
        const now = Date.now();
        const eligible = items.filter((creator) => {
          if (Number(creator.premium_enabled) !== 1 || !creator.portfolio_asset_id) return false;
          if (creator.premium_until && new Date(creator.premium_until).getTime() <= now) return false;
          return true;
        }).slice(0, 3);
        setCreators(eligible);
        setLoadError('');
      })
      .catch((error) => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Vitrine indisponível.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const authorFor = (creator: PremiumCreator): Author => ({
    id: creator.user_id,
    name: creator.display_name,
    handle: creator.handle,
    career: creator.career || 'Criador de conteúdo',
    niche: creator.niche || '',
    bio: creator.bio || '',
    location: creator.location || 'Angola',
    avatar: creator.avatar_asset_id ? `/api/assets/${encodeURIComponent(creator.avatar_asset_id)}/preview` : '',
    cover: `/api/assets/${encodeURIComponent(creator.portfolio_asset_id)}/preview`,
    count: 0,
    followers: '',
    engagement: '',
    verified: false,
    premium: true,
    featured: true,
    rating: '',
  });

  return (
    <section id="portfolio" className="section-gallery-showcase border-t border-neutral-100 py-12 transition-colors dark:border-neutral-800 sm:py-16">
      <div className="relative mx-auto mb-8 max-w-3xl text-center sm:mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"><Crown className="h-3.5 w-3.5" /> Vitrine Premium</span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">Portfólios em destaque</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">Uma montra exclusiva para os criadores que têm o recurso Premium activo e um trabalho público aprovado.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-neutral-400"><RefreshCw className="h-4 w-4 animate-spin" /> A carregar portfólios Premium…</div>
      ) : creators.length ? (
        <div className="mx-auto grid max-w-5xl grid-cols-1 justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const author = authorFor(creator);
            return (
              <article key={creator.id} className="group overflow-hidden rounded-3xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                <button type="button" onClick={() => onSelectCreator?.(author)} className="relative block aspect-[4/3] w-full overflow-hidden text-left">
                  <img src={author.cover} alt={`Portfólio de ${creator.display_name}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-neutral-950/75 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur"><Crown className="h-3.5 w-3.5 text-amber-300" /> Premium</span>
                </button>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    {author.avatar ? <img src={author.avatar} alt="" loading="lazy" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#52c1b9]/15 text-sm font-bold text-[#258b84]">{creator.display_name.split(/\s+/).slice(0,2).map((part) => part[0]).join('').toUpperCase()}</span>}
                    <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-neutral-950 dark:text-white">{creator.display_name}</h3><p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">{creator.niche || creator.career || 'Criador de conteúdo'}</p></div>
                    <ImageIcon className="h-4 w-4 shrink-0 text-[#258b84]" />
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400">{creator.bio || 'Explore os projectos e serviços deste criador Premium.'}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800"><span className="flex items-center gap-1 text-[10px] text-neutral-400"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Perfil Premium activo</span><button type="button" onClick={() => onSelectCreator?.(author)} className="inline-flex items-center gap-1 text-sm font-bold text-neutral-900 transition hover:text-[#258b84] dark:text-white">Ver perfil <ArrowUpRight className="h-4 w-4" /></button></div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700">
          <Crown className="mx-auto h-7 w-7 text-amber-400" />
          <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">Os primeiros portfólios Premium aparecerão aqui.</p>
          <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-neutral-500 dark:text-neutral-400">{loadError || 'Apenas perfis com Premium activo e um portfólio publicado entram nesta montra. Criadores podem activar o recurso no seu Estúdio.'}</p>
        </div>
      )}
    </section>
  );
}

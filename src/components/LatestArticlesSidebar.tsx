import React, { useState } from 'react';
import { Bookmark, Heart, Clock, ArrowRight, RotateCw, Play } from 'lucide-react';
import { Post, Author, Category } from '../types';

interface LatestArticlesSidebarProps {
  posts: Post[];
  authors: Author[];
  categories: Category[];
  onPlayAudio?: (post: Post) => void;
  playingPostId?: string | null;
  onSelectCreator?: (creator: Author) => void;
}

export default function LatestArticlesSidebar({
  posts,
  authors,
  categories,
  onPlayAudio,
  playingPostId,
  onSelectCreator
}: LatestArticlesSidebarProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter standard articles for the main vertical feeds
  const feedPosts = posts.filter(p => p.id !== 'post-1' && p.id !== 'post-2');

  // Sidebar widgets data
  const widgetAuthors = authors.slice(0, 5);
  const widgetCategories = categories.slice(0, 6);
  const widgetPopularPosts = posts.filter(p => p.id === 'post-3' || p.id === 'post-4' || p.id === 'post-5').slice(0, 3);
  const tags = ['UGC', 'ModaAngola', 'ReelsLuanda', 'MicroInfluencer', 'Maquilhagem', 'FotosProduto', 'Tecnologia', 'Huambo', 'Benguela', 'MarketingDigital'];

  const handleShowMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 4, feedPosts.length));
      setLoadingMore(false);
    }, 600);
  };

  return (
    <div className="section-latest-feed-sidebar py-16 border-t border-neutral-100 dark:border-neutral-800 transition-colors font-sans" id="latest-articles">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* Left Hand: Latest Articles Feed with Pagination */}
        <div className="lg:col-span-2 space-y-8">
          <div className="text-left">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Feed de Ideias & Entregas Recentes
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              Inspire-se nos briefings bem-sucedidos e novidades do ecossistema de criadores em Angola
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {feedPosts.slice(0, visibleCount).map((post) => {
              const isAudio = post.postType === 'audio';
              const isPlaying = playingPostId === post.id;

              return (
                <div
                  key={post.id}
                  className="group relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-3.5 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Left overlay tag */}
                    <div className="absolute top-2.5 left-2.5">
                      {post.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center rounded-full bg-[#52c1b9] text-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>

                    {/* Audio Overlay Play control */}
                    {isAudio ? (
                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <button
                          onClick={() => onPlayAudio && onPlayAudio(post)}
                          className="flex items-center justify-center rounded-full border border-white bg-neutral-900/60 text-white w-8 h-8 hover:bg-emerald-500 shadow cursor-pointer"
                        >
                          {isPlaying ? (
                            <span className="w-4 h-4 flex gap-px items-end justify-center">
                              <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_100ms] h-full" />
                              <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_300ms] h-2/3" />
                              <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_500ms] h-4/5" />
                            </span>
                          ) : (
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* Info details underneath image */}
                  <div className="mt-4 flex flex-col space-y-2.5 text-left grow">
                    <button
                      onClick={() => onSelectCreator && onSelectCreator(post.author)}
                      className="post-card-meta flex items-center text-[11px] text-neutral-500 dark:text-neutral-400 text-left cursor-pointer"
                    >
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-5 h-5 rounded-full object-cover mr-2"
                      />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-300">
                        {post.author.name}
                      </span>
                      <span className="mx-1">·</span>
                      <span>{post.date}</span>
                    </button>

                    <h3 className="block text-sm sm:text-base font-bold text-neutral-950 dark:text-white leading-snug line-clamp-2 hover:text-[#52c1b9] transition-colors">
                      <span className="cursor-pointer" onClick={() => onSelectCreator && onSelectCreator(post.author)}>
                        {post.title}
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-auto">
                      <div className="flex items-center gap-x-2">
                        <span className="inline-block bg-neutral-150 dark:bg-neutral-800 text-[10px] text-neutral-500 font-bold px-2.5 py-0.5 rounded-full">
                          {post.author.career}
                        </span>
                      </div>

                      <div className="flex items-center gap-x-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                        <Clock className="w-3 h-3" />
                        <span>Métrica: {post.author.followers}</span>
                        <button className="relative flex w-6 h-6 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer">
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination loading control */}
          {visibleCount < feedPosts.length && (
            <div className="pt-6 text-center">
              <button
                onClick={handleShowMore}
                disabled={loadingMore}
                className="inline-flex items-center justify-center gap-x-2 rounded-full bg-neutral-950 hover:bg-[#52c1b9] text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-[#52c1b9] dark:hover:text-white px-8 py-3.5 text-sm font-bold shadow transition-all cursor-pointer"
              >
                {loadingMore ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>A carregar...</span>
                  </>
                ) : (
                  <>
                    <span>Ver Mais Casos</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Hand Sidebar: widgets columns */}
        <div className="space-y-8 text-left">
          
          {/* Widget 1: Hottest Authors */}
          <div className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-950 dark:text-white text-base mb-5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Perfis Disponíveis para Bookings
            </h3>
            <div className="space-y-4">
              {widgetAuthors.map((author) => (
                <button
                  key={author.id}
                  onClick={() => onSelectCreator && onSelectCreator(author)}
                  className="flex items-center justify-between w-full text-left cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-500/10"
                    />
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm group-hover:text-[#52c1b9] transition-colors">
                        {author.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">{author.career} • {author.followers}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#52c1b9] hover:underline">
                    Ver
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 2: Popular Categories */}
          <div className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-950 dark:text-white text-base mb-5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Niches Recomendados
            </h3>
            <div className="space-y-3.5">
              {widgetCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium hover:text-[#52c1b9] cursor-pointer">
                    {cat.name}
                  </span>
                  <span className="text-xs bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded-full text-neutral-500">
                    {cat.count} Criadores
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Popular Articles */}
          <div className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-950 dark:text-white text-base mb-5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Entregas Populares
            </h3>
            <div className="space-y-4">
              {widgetPopularPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onSelectCreator && onSelectCreator(post.author)}
                  className="flex gap-3 text-left w-full cursor-pointer group"
                >
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col justify-between py-0.5">
                    <h4 className="font-bold text-neutral-900 dark:text-white text-xs line-clamp-2 group-hover:text-[#52c1b9] leading-snug">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Por {post.author.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 4: Tags Cloud */}
          <div className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-950 dark:text-white text-base mb-5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Tags Frequentes
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-neutral-50 hover:bg-[#52c1b9]/10 dark:bg-neutral-800 hover:text-[#52c1b9] cursor-pointer text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full text-neutral-600 dark:text-neutral-400 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

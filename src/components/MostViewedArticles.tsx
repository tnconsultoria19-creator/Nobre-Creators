import React, { useState } from 'react';
import { Play, Heart, MessageSquare, Bookmark, Clock, ArrowRight, Star } from 'lucide-react';
import { Post, Author } from '../types';

interface MostViewedArticlesProps {
  posts: Post[];
  onPlayAudio?: (post: Post) => void;
  playingPostId?: string | null;
  onSelectCreator?: (creator: Author) => void;
}

export default function MostViewedArticles({ posts, onPlayAudio, playingPostId, onSelectCreator }: MostViewedArticlesProps) {
  const [activeTab, setActiveTab] = useState('Moda');
  const tabs = ['Moda', 'Beleza', 'Tecnologia', 'Lifestyle'];

  // Filter posts based on activeTab categories
  const filteredPosts = posts.filter(p => {
    if (activeTab === 'Moda') return p.categories.some(c => c.handle === 'moda');
    if (activeTab === 'Beleza') return p.categories.some(c => c.handle === 'beleza-makeup' || c.handle === 'skincare-fragrancias');
    if (activeTab === 'Tecnologia') return p.categories.some(c => c.handle === 'tecnologia');
    return p.categories.some(c => c.handle === 'lifestyle' || c.handle === 'viagens');
  });

  const largePost = filteredPosts[0] || posts[0];
  const rightListPosts = filteredPosts.slice(1, 4).length > 0 ? filteredPosts.slice(1, 4) : posts.slice(2, 5);

  return (
    <div className="section-magazine-1 py-16 border-t border-neutral-100 dark:border-neutral-800 transition-colors">
      <div className="section-tab-header relative mb-9 flex flex-col">
        <div className="relative mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
            Portfólio de Campanhas Recentes
          </h1>
          <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
            Explore as entregas UGC e produções recentes de criadores divididas por categorias
          </h3>
        </div>

        {/* Tab Row with View All Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex grow flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <a
            className="ms-auto shrink-0 inline-flex items-center justify-center gap-x-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white"
            href="#directorio"
          >
            <span>Ver Todos Criadores</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Magazine Layout */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
        {/* Left Large Column Card */}
        {largePost && (
          <div className="group post-card-2 relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-video rounded-2xl overflow-hidden shrink-0">
              <img
                src={largePost.featuredImage}
                alt={largePost.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Play Overlay indicator on image bottom-left */}
              <div className="absolute bottom-3 left-3">
                <button
                  onClick={() => onPlayAudio && onPlayAudio(largePost)}
                  className="flex items-center justify-center rounded-full border border-white bg-neutral-900/60 text-white w-9 h-9 hover:bg-emerald-500 hover:scale-110 transition-all shadow cursor-pointer"
                  title="Ouvir Áudio/Vídeo"
                >
                  {playingPostId === largePost.id ? (
                    <span className="w-4 h-4 flex gap-0.5 items-end justify-center">
                      <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_100ms] h-full" />
                      <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_300ms] h-2/3" />
                      <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_500ms] h-4/5" />
                    </span>
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Badge top-left */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {largePost.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-xs font-semibold shadow"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Info panel below image */}
            <div className="mt-5 flex flex-col sm:px-2">
              <div className="space-y-3">
                <button
                  onClick={() => onSelectCreator && onSelectCreator(largePost.author)}
                  className="post-card-meta flex flex-wrap items-center text-xs text-neutral-500 dark:text-neutral-400 relative text-left cursor-pointer w-full"
                >
                  <div className="relative flex items-center gap-x-2">
                    <img
                      src={largePost.author.avatar}
                      alt={largePost.author.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
                    />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-300">
                      {largePost.author.name}
                    </span>
                    {largePost.author.verified && (
                      <span className="w-3 h-3 bg-emerald-500 text-white text-[7px] flex items-center justify-center rounded-full">✓</span>
                    )}
                  </div>
                  <span className="mx-1.5 font-medium">·</span>
                  <span>{largePost.date}</span>
                </button>

                <h2 className="post-card-title block font-bold text-neutral-950 dark:text-white text-base sm:text-lg md:text-xl transition-colors hover:text-emerald-500">
                  <span className="cursor-pointer" onClick={() => onSelectCreator && onSelectCreator(largePost.author)}>
                    {largePost.title}
                  </span>
                </h2>
                <p className="block text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {largePost.excerpt}
                </p>
              </div>

              <hr className="my-5 w-full border-t border-neutral-100 dark:border-neutral-800" />

              <div className="relative flex flex-wrap gap-x-2 gap-y-1">
                <button 
                  onClick={() => onSelectCreator && onSelectCreator(largePost.author)}
                  className="flex h-8 items-center rounded-full bg-rose-50 dark:bg-rose-950/30 px-3 text-xs leading-none text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500" />
                  <span>{largePost.author.engagement} Engajamento</span>
                </button>
                <div className="post-card-save-btn flex items-center gap-x-2 text-xs ms-auto text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Taxa Inicial: {largePost.author.startingPrice}</span>
                  <button 
                    onClick={() => onSelectCreator && onSelectCreator(largePost.author)}
                    className="relative flex w-8 h-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Stack of Lists cards */}
        <div className="grid gap-6">
          {rightListPosts.map((post) => {
            const isAudio = post.postType === 'audio';
            const isPlaying = playingPostId === post.id;

            return (
              <div
                key={post.id}
                className="group post-card-6 relative flex flex-row gap-5 rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 shadow-sm hover:shadow-md transition-all duration-300 items-center justify-between"
              >
                <div className="flex grow flex-col gap-y-2.5 pr-2">
                  <div className="space-y-2.5">
                    <div className="category-badge-list flex flex-wrap gap-x-2 gap-y-1">
                      {post.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>

                    <h2 className="post-card-title block text-sm sm:text-base font-bold text-neutral-950 dark:text-white transition-colors hover:text-emerald-500 line-clamp-2">
                      <span className="cursor-pointer" onClick={() => onSelectCreator && onSelectCreator(post.author)}>
                        {post.title}
                      </span>
                    </h2>

                    <button
                      onClick={() => onSelectCreator && onSelectCreator(post.author)}
                      className="post-card-meta flex flex-wrap items-center text-[11px] text-neutral-500 dark:text-neutral-400 text-left cursor-pointer"
                    >
                      <div className="relative flex items-center gap-x-1.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-neutral-900 dark:text-neutral-300">
                          {post.author.name}
                        </span>
                      </div>
                      <span className="mx-1 font-medium">·</span>
                      <span>{post.date}</span>
                    </button>
                  </div>

                  <div className="relative flex flex-wrap gap-x-2 gap-y-1 mt-auto pt-2">
                    <span className="flex h-7 items-center rounded-full bg-[#52c1b9]/10 text-[#2b9d96] px-2.5 text-[10px] font-bold">
                      {post.author.career}
                    </span>
                    <div className="flex items-center gap-x-1.5 text-[10px] ms-auto text-neutral-500 dark:text-neutral-400">
                      <Clock className="w-3 h-3" />
                      <span>{post.author.followers} Seguidores</span>
                    </div>
                  </div>
                </div>

                {/* Cover Image Column */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-neutral-100 dark:border-neutral-800">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isAudio ? (
                    <div className="absolute bottom-1.5 left-1.5 z-10">
                      <button
                        onClick={() => onPlayAudio && onPlayAudio(post)}
                        className="flex items-center justify-center rounded-full border border-white bg-neutral-900/60 text-white w-7 h-7 hover:bg-emerald-500 shadow cursor-pointer"
                      >
                        {isPlaying ? (
                          <span className="w-3.5 h-3.5 flex gap-px items-end justify-center">
                            <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_100ms] h-full" />
                            <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_300ms] h-2/3" />
                            <span className="w-0.5 bg-white animate-[bounce_0.8s_infinite_500ms] h-4/5" />
                          </span>
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-white ml-px" />
                        )}
                      </button>
                    </div>
                  ) : null}
                  <button 
                    onClick={() => onSelectCreator && onSelectCreator(post.author)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Advertisement Banner - Repurposed for Nobre Managed */}
      <div className="mt-16 text-center select-none" id="nobre-managed">
        <span className="text-xs text-neutral-400 block mb-2 uppercase tracking-widest font-semibold">- SOLUÇÕES CORPORATIVAS -</span>
        <div className="inline-block relative w-full max-w-4xl rounded-3xl overflow-hidden bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 dark:border-emerald-500/10 p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-2 max-w-2xl">
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/20">Nobre Managed Service</span>
              <h4 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">Quer contratar 5 a 50 criadores de uma só vez?</h4>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                A nossa equipa trata de tudo: recrutamento, briefings, revisão de roteiros, minutas contratuais prontas, moderação do Nobre Escrow e relatórios finais de performance.
              </p>
            </div>
            <button
              onClick={() => onSelectCreator && onSelectCreator(posts[0].author)} // fallback to trigger booking flow
              className="bg-neutral-950 hover:bg-emerald-600 dark:bg-white dark:hover:bg-emerald-500 text-white dark:text-neutral-950 dark:hover:text-white rounded-full px-6 py-3 text-xs sm:text-sm font-bold transition-all shadow cursor-pointer whitespace-nowrap"
            >
              Solicitar Campanha Gerida
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-56 h-56 rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-xl"></div>
          <div className="absolute -left-20 -top-20 w-56 h-56 rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-xl"></div>
        </div>
      </div>
    </div>
  );
}

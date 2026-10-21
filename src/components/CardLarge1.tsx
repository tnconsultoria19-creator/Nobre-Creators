import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Clock, Play, Music, Star } from 'lucide-react';
import { Post, Author } from '../types';

interface CardLarge1Props {
  posts: Post[];
  onPlayAudio?: (post: Post) => void;
  playingPostId?: string | null;
  onSelectCreator?: (creator: Author) => void;
}

export default function CardLarge1({ posts, onPlayAudio, playingPostId, onSelectCreator }: CardLarge1Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const activePost = posts[activeIndex] || posts[0];

  return (
    <div className="section-large-slider relative pt-10 lg:pt-20">
      <div className="relative mb-12 flex flex-wrap items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
            Estrelas da Semana
          </h1>
          <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
            Profissionais com experiência demonstrada e projectos técnicos em destaque
          </h3>
        </div>
      </div>

      <div className="nc-CardLarge1 relative flex flex-col-reverse justify-end md:flex-row min-h-[480px]">
        {/* Left Floating Overlay Information Card */}
        <div className="z-10 -mt-8 w-full px-3 sm:px-6 md:absolute md:start-0 md:top-1/2 md:mt-0 md:w-3/5 md:-translate-y-1/2 md:px-0 lg:w-1/2 xl:w-2/5 transition-all">
          <div className="nc-CardLarge1__left space-y-4 rounded-3xl bg-white/70 p-4 shadow-xl backdrop-blur-xl border border-white/20 sm:space-y-5 sm:p-8 md:px-10 xl:py-14 dark:bg-neutral-900/80 dark:border-neutral-800 transition-all">
            {/* Category badge */}
            <div className="category-badge-list flex flex-wrap gap-x-2 gap-y-1">
              {activePost.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  {cat.name}
                </span>
              ))}
              <span className="inline-flex items-center gap-x-1 rounded-full bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {activePost.author.rating}
              </span>
            </div>

            {/* Title */}
            <h2 className="nc-card-title text-xl font-bold sm:text-2xl lg:text-3xl text-neutral-950 dark:text-white leading-snug transition-colors text-left">
              <span 
                onClick={() => onSelectCreator && onSelectCreator(activePost.author)}
                className="line-clamp-2 hover:text-[#52c1b9] transition-colors cursor-pointer"
              >
                {activePost.title}
              </span>
            </h2>

            {/* Author Meta */}
            <button
              onClick={() => onSelectCreator && onSelectCreator(activePost.author)}
              className="post-card-meta-3 relative flex items-center text-xs text-neutral-500 dark:text-neutral-400 text-left cursor-pointer w-full"
            >
              <img
                src={activePost.author.avatar}
                alt={activePost.author.name}
                className="w-10 h-10 rounded-full object-cover mr-3 ring-2 ring-[#52c1b9]/20"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-neutral-900 dark:text-neutral-200 transition-colors flex items-center gap-1">
                  {activePost.author.name}
                  {activePost.author.verified && (
                    <span className="w-3.5 h-3.5 bg-[#52c1b9] text-white text-[8px] flex items-center justify-center rounded-full">✓</span>
                  )}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {activePost.author.career} • {activePost.author.location}
                </p>
              </div>
            </button>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-4 text-xs font-semibold">
              <span className="inline-flex items-center rounded-full bg-pink-50 dark:bg-pink-950/30 px-3 py-1.5 text-pink-600 dark:text-pink-400">
                {activePost.author.followers} de experiência
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 text-blue-600 dark:text-blue-400">
                {activePost.author.engagement} projectos concluídos
              </span>

              <div className="flex items-center gap-x-2 text-xs text-neutral-500 dark:text-neutral-400 ms-auto font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Cachê: {activePost.author.startingPrice}</span>
                <button className="relative flex w-8 h-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                  <Bookmark className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Slider Left/Right round navigation */}
          <div className="p-4 sm:px-10 sm:pt-8 flex items-center">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors mr-2 w-11 h-11 text-neutral-700 dark:text-neutral-300 cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-11 h-11 text-neutral-700 dark:text-neutral-300 cursor-pointer"
              aria-label="Seguinte"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Featured Image Column */}
        <div className="w-full md:w-[75%] lg:w-2/3 relative rounded-3xl overflow-hidden shadow-lg h-[340px] sm:h-[420px] md:h-[500px]">
          <img
            src={activePost.featuredImage}
            alt={activePost.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Type Icon Indicator / Player Play Button overlay */}
          <div className="absolute end-5 top-5">
            {activePost.postType === 'audio' ? (
              <button
                onClick={() => onPlayAudio && onPlayAudio(activePost)}
                className="flex items-center justify-center rounded-full border-2 border-white bg-black/60 hover:bg-[#52c1b9] text-white w-12 h-12 transition-all shadow-lg group cursor-pointer"
                title="Ouvir Apresentação"
              >
                <Music className={`w-5 h-5 ${playingPostId === activePost.id ? 'animate-bounce text-[#52c1b9]' : ''}`} />
              </button>
            ) : activePost.postType === 'video' ? (
              <span className="flex items-center justify-center rounded-full border-2 border-white bg-black/60 text-white w-12 h-12 shadow-lg">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

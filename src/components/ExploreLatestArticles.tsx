import React from 'react';
import { Play, Music, Heart, MessageSquare, Bookmark } from 'lucide-react';
import { Post } from '../types';

interface ExploreLatestArticlesProps {
  posts: Post[];
  onPlayAudio?: (post: Post) => void;
  playingPostId?: string | null;
  onSelectCreator?: (creator: any) => void;
}

export default function ExploreLatestArticles({ posts, onPlayAudio, playingPostId, onSelectCreator }: ExploreLatestArticlesProps) {
  // Let's filter the posts to show 4 latest unique creations
  const latestPosts = posts.filter(p => p.id === 'post-1' || p.id === 'post-2' || p.id === 'post-3' || p.id === 'post-5');

  return (
    <div className="section-slider-posts relative py-16">
      <div className="relative mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
            Conteúdo em Destaque / UGC Showcase
          </h1>
          <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
            Amostras reais de publicações UGC, fotografias profissionais e vídeos explicativos dos nossos criadores
          </h3>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {latestPosts.map((post) => {
          const isPlaying = playingPostId === post.id;
          const isAudio = post.postType === 'audio';

          return (
            <div
              key={post.id}
              className="group post-card-10-v2 relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-3 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Thumbnail with Overlay elements */}
              <div className="relative w-full shrink-0 overflow-hidden rounded-2xl aspect-square sm:aspect-[11/12]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {isAudio ? (
                    <button
                      onClick={() => onPlayAudio && onPlayAudio(post)}
                      className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center transform scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl cursor-pointer"
                      title="Ouvir Apresentação"
                    >
                      {isPlaying ? (
                        <span className="w-5 h-5 flex gap-0.5 items-end justify-center">
                          <span className="w-1 bg-white animate-[bounce_0.8s_infinite_100ms] h-full" />
                          <span className="w-1 bg-white animate-[bounce_0.8s_infinite_300ms] h-2/3" />
                          <span className="w-1 bg-white animate-[bounce_0.8s_infinite_500ms] h-4/5" />
                        </span>
                      ) : (
                        <Play className="w-6 h-6 fill-white ml-1" />
                      )}
                    </button>
                  ) : null}
                </div>

                {/* Overlaid Badges */}
                <div className="absolute inset-x-3 top-3 flex items-start justify-between">
                  <div className="category-badge-list flex flex-wrap gap-x-2 gap-y-1">
                    {post.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center rounded-full bg-emerald-50/90 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  <button className="flex w-8 h-8 items-center justify-center rounded-full bg-white/95 dark:bg-neutral-900/95 hover:bg-neutral-100 transition-colors shadow cursor-pointer">
                    <Bookmark className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Title & metadata content */}
              <div className="mt-4 flex flex-col space-y-3">
                <h2 className="block text-base font-bold text-neutral-950 dark:text-white leading-snug transition-colors line-clamp-2 hover:text-emerald-500">
                  <span className="cursor-pointer" onClick={() => onSelectCreator && onSelectCreator(post.author)}>
                    {post.title}
                  </span>
                </h2>

                <button
                  onClick={() => onSelectCreator && onSelectCreator(post.author)}
                  className="post-card-meta-2 relative flex items-center gap-2.5 text-left cursor-pointer w-full"
                >
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-200">{post.author.name}</p>
                    <p className="text-[10px] text-neutral-400">{post.author.career} • {post.date}</p>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

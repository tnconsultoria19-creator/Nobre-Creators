import React from 'react';
import { Layers, Bookmark, Heart } from 'lucide-react';
import { Post, Author } from '../types';

interface TheGalleryPostsProps {
  posts: Post[];
  onSelectCreator?: (creator: Author) => void;
}

export default function TheGalleryPosts({ posts, onSelectCreator }: TheGalleryPostsProps) {
  // Let's filter to show the beautiful gallery posts
  const galleryPosts = posts.filter(p => p.postType === 'gallery').slice(0, 4);

  return (
    <div className="section-gallery-showcase py-16 border-t border-neutral-100 dark:border-neutral-800 transition-colors">
      <div className="relative mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
          Portfólios Fotográficos & Lookbooks
        </h1>
        <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
          Lookbooks de moda, sessões de produtos e ensaios criativos desenvolvidos pelos nossos fotógrafos e modelos
        </h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {galleryPosts.map((post) => (
          <div
            key={post.id}
            className="group post-card-3 relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-3 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Multi-image Thumbnail Grid */}
            <div className="relative w-full shrink-0 overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-square flex flex-col gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5">
              {/* Main big image */}
              <div className="grow relative rounded-xl overflow-hidden h-2/3">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-x-1.5 rounded-full bg-black/60 text-white px-2 py-0.5 text-[10px] font-bold">
                    <Layers className="w-3.5 h-3.5" /> Book Fotográfico
                  </span>
                </div>
              </div>

              {/* Overlapping grid of small pictures at the bottom */}
              {post.galleryImgs && post.galleryImgs.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 h-1/3">
                  {post.galleryImgs.slice(0, 3).map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden h-full">
                      <img
                        src={img}
                        alt={`gallery ${i}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 2 && post.galleryImgs && post.galleryImgs.length > 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xs font-bold font-mono">
                            +{post.galleryImgs.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info details below grid */}
            <div className="mt-4 flex flex-col space-y-3 grow">
              <div className="category-badge-list flex flex-wrap gap-x-2 gap-y-1">
                {post.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              <h2 className="block text-sm sm:text-base font-bold text-neutral-950 dark:text-white leading-snug line-clamp-2 hover:text-emerald-500 transition-colors grow">
                <span className="cursor-pointer" onClick={() => onSelectCreator && onSelectCreator(post.author)}>
                  {post.title}
                </span>
              </h2>

              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-3 mt-auto">
                <button
                  onClick={() => onSelectCreator && onSelectCreator(post.author)}
                  className="post-card-meta flex items-center gap-x-2 text-left cursor-pointer"
                >
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
                  />
                  <div className="text-[10px]">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-300">{post.author.name}</p>
                    <p className="text-neutral-400">{post.author.career}</p>
                  </div>
                </button>

                <div className="flex items-center gap-x-1">
                  <button 
                    onClick={() => onSelectCreator && onSelectCreator(post.author)}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-600 dark:fill-rose-400" />
                  </button>
                  <button className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

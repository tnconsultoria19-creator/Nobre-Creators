import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Author } from '../types';

interface TopAuthorsProps {
  authors: Author[];
  onSelectCreator?: (creator: Author) => void;
}

export default function TopAuthors({ authors, onSelectCreator }: TopAuthorsProps) {
  const top10 = authors.slice(0, 10);
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="section-top-authors py-16 border-t border-neutral-100 dark:border-neutral-800 transition-colors" id="top-creators">
      <div className="relative mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
          Criadores Nobres em Alta
        </h1>
        <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
          Descubra os perfis verificados com maior engajamento, consistência e avaliações positivas de Angola
        </h3>
      </div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {top10.map((author, index) => {
          const isFollowing = following[author.id];
          return (
            <button
              key={author.id}
              onClick={() => onSelectCreator && onSelectCreator(author)}
              className="card-author-grid group relative flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer w-full"
            >
              {/* Rank Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs w-6 h-6">
                  {index + 1}
                </span>
              </div>

              {/* Avatar */}
              <div className="relative">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                />
                <span className="absolute bottom-1 right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-[#52c1b9] fill-[#52c1b9] text-white" />
                </span>
              </div>

              {/* Name & Role */}
              <div className="mt-4 space-y-1">
                <h4 className="font-bold text-neutral-950 dark:text-white text-sm sm:text-base line-clamp-1">
                  {author.name}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 font-medium">
                  {author.career}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {author.followers} seguidores
                </p>
              </div>

              {/* Rating representation */}
              <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{author.rating || '4.90'}</span>
              </div>

              {/* Follow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(author.id);
                }}
                className={`mt-5 w-full rounded-full py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}

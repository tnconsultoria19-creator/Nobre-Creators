import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface ExploreCategoriesProps {
  categories: Category[];
  onSelectCategory?: (category: Category | null) => void;
  selectedCategory?: Category | null;
}

export default function ExploreCategories({ categories, onSelectCategory, selectedCategory }: ExploreCategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400';
      case 'blue': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
      case 'red': return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400';
      case 'green': return 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400';
      case 'yellow': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400';
      case 'purple': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400';
      case 'pink': return 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400';
      case 'teal': return 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400';
      case 'orange': return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400';
      default: return 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  const getDotColor = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-500';
      case 'blue': return 'bg-blue-500';
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'teal': return 'bg-teal-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-neutral-500';
    }
  };

  return (
    <div className="section-slider-new-categories relative py-16">
      <div className="relative mb-12 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white transition-colors">
            Niches de Criadores
          </h1>
          <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400 transition-colors">
            Descubra talentos e perfis UGC por área de especialização em Angola
          </h3>
        </div>

        <div className="relative flex items-center text-neutral-500 dark:text-neutral-400 gap-x-2">
          <button
            onClick={() => scroll('left')}
            className="flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-11 h-11 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-11 h-11 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory?.id === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : category)}
              className={`card-category-4 text-left group relative flex flex-col min-w-[200px] sm:min-w-[240px] snap-start cursor-pointer border-2 rounded-3xl p-2 transition-all ${
                isSelected 
                  ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10' 
                  : 'border-transparent'
              }`}
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shrink-0 shadow-sm border border-neutral-100 dark:border-neutral-800 w-full">
                <img
                  src={category.thumbnail}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90"
                />
                <div className="absolute start-3 top-3">
                  <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${getBadgeColor(category.color)}`}>
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Title & Count Info below image */}
              <div className="mt-4 flex items-center px-1">
                <div className={`w-3 h-3 rounded-full shrink-0 ${getDotColor(category.color)} transition-transform group-hover:scale-110`} />
                <div className="ms-3 space-y-0.5">
                  <p className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-neutral-100 transition-colors">
                    {category.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {category.count} Criadores Ativos
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Play, Volume2, Maximize, RotateCcw } from 'lucide-react';
import { Post } from '../types';

interface TheVideosPlayerProps {
  posts: Post[];
}

export default function TheVideosPlayer({ posts }: TheVideosPlayerProps) {
  const videoPosts = posts.filter(p => p.postType === 'video');
  const [activeVideo, setActiveVideo] = useState<Post>(videoPosts[0] || posts[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Convert watch URLs to embed URLs if we can, or use nice placeholders for an immersive experience
  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1`;
      }
    }
    return 'https://www.youtube.com/embed/vHBodN0Mirs'; // Fallback
  };

  return (
    <div className="section-video-player py-16 lg:py-20 bg-neutral-900 text-white rounded-[40px] px-6 sm:px-10 lg:p-16 my-16 transition-colors relative overflow-hidden">
      {/* Visual background details matching custom design */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="relative mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Visitas de Obra e Demonstrações Técnicas
        </h1>
        <h3 className="mt-3.5 max-w-3xl text-lg font-normal text-neutral-400 lg:text-xl">
          Veja apresentações de projectos, demonstrações de serviços e registos de execução.
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Video Theater */}
        <div className="col-span-2 flex flex-col space-y-4">
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800 shadow-2xl">
            {isPlaying ? (
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <img
                  src={activeVideo.featuredImage}
                  alt={activeVideo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>
                
                {/* Overlay Badge */}
                <div className="z-10 self-start">
                  {activeVideo.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center rounded-full bg-emerald-500/90 text-white px-3 py-1 text-xs font-semibold"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                {/* Big Custom Play Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="z-10 self-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 hover:bg-emerald-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/30 transition-all shadow-2xl group cursor-pointer"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1.5 transition-transform group-hover:scale-110" />
                </button>

                {/* Info Text */}
                <div className="z-10 text-left space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold leading-snug text-white line-clamp-1">
                    {activeVideo.title}
                  </h2>
                  <div className="flex items-center gap-x-3 text-xs text-neutral-300">
                    <img
                      src={activeVideo.author.avatar}
                      alt={activeVideo.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-white">{activeVideo.author.name}</span>
                    <span>·</span>
                    <span>{activeVideo.date}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Player controls details row */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-850/50 border border-neutral-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-neutral-850 rounded-full transition-colors text-neutral-400 hover:text-white cursor-pointer"
              >
                <Play className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-neutral-850 rounded-full transition-colors text-neutral-400 hover:text-white cursor-pointer">
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-xs text-neutral-400">0:00 / 1:00 (UGC Reel)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-neutral-850 rounded-full transition-colors text-neutral-400 hover:text-white cursor-pointer">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-neutral-850 rounded-full transition-colors text-neutral-400 hover:text-white cursor-pointer">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Videos List */}
        <div className="flex flex-col h-[400px] sm:h-[480px] lg:h-full justify-between">
          <div className="font-semibold text-base mb-4 text-left border-b border-neutral-800 pb-3">
            Lista de Demonstrações ({videoPosts.length})
          </div>

          <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800 h-full">
            {videoPosts.map((post) => {
              const isActive = post.id === activeVideo.id;
              return (
                <button
                  key={post.id}
                  onClick={() => {
                    setActiveVideo(post);
                    setIsPlaying(false);
                  }}
                  className={`w-full group flex flex-row gap-4 p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-800/80 border-emerald-500/50 shadow'
                      : 'bg-neutral-850/30 border-transparent hover:bg-neutral-800/40 hover:border-neutral-800'
                  }`}
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between py-0.5">
                    <h4 className={`text-sm font-bold leading-snug line-clamp-2 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-neutral-200 group-hover:text-emerald-400'
                    }`}>
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-medium">
                      Por {post.author.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, X, SkipForward, SkipBack, Repeat, Music } from 'lucide-react';
import { Post } from '../types';

interface AudioPlayerBottomProps {
  post: Post | null;
  onClose: () => void;
  playing: boolean;
  onTogglePlay: () => void;
}

export default function AudioPlayerBottom({
  post,
  onClose,
  playing,
  onTogglePlay
}: AudioPlayerBottomProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoop, setIsLoop] = useState(false);

  useEffect(() => {
    if (audioRef.current && post?.audioUrl) {
      audioRef.current.src = post.audioUrl;
      audioRef.current.load();
      if (playing) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [post?.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!post) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-neutral-900/95 border-t border-neutral-200 dark:border-neutral-800 p-4 shadow-2xl backdrop-blur-md transition-colors">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        loop={isLoop}
        onEnded={() => {
          if (!isLoop) onTogglePlay();
        }}
      />

      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Track Details */}
        <div className="flex items-center space-x-3 w-full sm:w-1/3 justify-start">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200 dark:border-neutral-800">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Music className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>
          <div className="text-left space-y-0.5 max-w-[200px]">
            <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white line-clamp-1">
              {post.title}
            </h4>
            <p className="text-[11px] text-neutral-400 font-medium">
              By {post.author.name}
            </p>
          </div>
        </div>

        {/* Center Side: Track Controls */}
        <div className="flex flex-col items-center space-y-1.5 w-full sm:w-1/3">
          <div className="flex items-center space-x-4">
            <button className="text-neutral-400 hover:text-emerald-500 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={onTogglePlay}
              className="flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white w-10 h-10 shadow-md transition-all transform hover:scale-105 active:scale-95"
            >
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <button className="text-neutral-400 hover:text-emerald-500 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsLoop(!isLoop)}
              className={`p-1 rounded transition-colors ${
                isLoop ? 'text-emerald-500 bg-emerald-500/10' : 'text-neutral-400 hover:text-neutral-600'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2.5 w-full">
            <span className="text-[10px] text-neutral-400 font-medium min-w-[30px] text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] text-neutral-400 font-medium min-w-[30px] text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Side: Volume & Close Actions */}
        <div className="flex items-center space-x-4 w-full sm:w-1/3 justify-end">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-neutral-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-24 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-500 dark:text-neutral-400"
            title="Close Audio Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

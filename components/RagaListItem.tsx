import React from 'react';
import { Raga, RagaStyle } from '../types';
import MusicNoteIcon from './icons/MusicNoteIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import ErrorIcon from './icons/ErrorIcon';

interface RagaListItemProps {
  raga: Raga;
  onActivate: () => void;
  onSeek: (time: number) => void;
  isActive: boolean;
  isPlaying: boolean;
  hasError: boolean;
  currentTime: number;
  duration: number;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const RagaListItem: React.FC<RagaListItemProps> = ({ raga, onActivate, onSeek, isActive, isPlaying, hasError, currentTime, duration }) => {
  const activeClasses = isActive 
    ? 'bg-orange-500/20 border-orange-400' 
    : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50 hover:border-slate-500';
  
  const styleColor = raga.style === RagaStyle.Hindustani ? 'text-teal-400' : 'text-fuchsia-400';

  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onActivate();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  return (
    <li
      onClick={onActivate}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col gap-4 ${activeClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className={`flex-shrink-0 p-2 rounded-full ${isActive ? 'bg-orange-400/20' : 'bg-slate-700'}`}>
            <MusicNoteIcon className={`w-6 h-6 ${isActive ? 'text-orange-300' : 'text-slate-400'}`} />
          </div>
          <div className="truncate">
            <p className={`font-semibold text-lg truncate ${isActive ? 'text-orange-300' : 'text-slate-100'}`}>{raga.name}</p>
            <p className={`text-sm font-medium ${styleColor}`}>{raga.style}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
            {raga.audioUrl && (
              <>
                <a 
                  href={raga.audioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => e.stopPropagation()} 
                  className="text-xs text-slate-500 hover:text-orange-400 hover:underline" 
                  title="Open audio source in new tab"
                >
                  Source
                </a>
                {hasError ? (
                  <div title="Audio file failed to load" className="p-2 rounded-full bg-red-900/50 text-red-400">
                    <ErrorIcon className="w-6 h-6" />
                  </div>
                ) : (
                  !isPlaying && (
                    <button
                      onClick={handlePlayButtonClick}
                      className="p-2 rounded-full transition-colors duration-200 bg-slate-600 text-slate-200 hover:bg-slate-500"
                      aria-label={`Play Raga ${raga.name}`}
                    >
                      <PlayIcon className="w-6 h-6" />
                    </button>
                  )
                )}
              </>
            )}
        </div>
      </div>

      {raga.audioUrl && isPlaying && !hasError && (
        <div className="flex items-center gap-3 w-full" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handlePlayButtonClick}
            className="flex-shrink-0 p-2 rounded-full bg-orange-400 text-white"
            aria-label={`Pause Raga ${raga.name}`}
          >
            <PauseIcon className="w-5 h-5" />
          </button>
          <span className="text-xs text-slate-400 font-mono w-10 text-center">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-400"
          />
          <span className="text-xs text-slate-400 font-mono w-10 text-center">{formatTime(duration)}</span>
        </div>
      )}
    </li>
  );
};

export default RagaListItem;

import React, { useState, useMemo } from 'react';
import { Raga, RagaStyle } from '../types';
import RagaListItem from './RagaListItem';

interface RagaListProps {
  ragas: Raga[];
  onActivateRaga: (raga: Raga) => void;
  onSeek: (time: number) => void;
  activeRagaId: string | null;
  playingRagaId: string | null;
  audioErrorId: string | null;
  currentTime: number;
  duration: number;
}

const RagaList: React.FC<RagaListProps> = ({ ragas, onActivateRaga, onSeek, activeRagaId, playingRagaId, audioErrorId, currentTime, duration }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [styleFilter, setStyleFilter] = useState<RagaStyle | 'All'>('All');

  const filteredRagas = useMemo(() => {
    return ragas
      .filter(raga => {
        if (styleFilter === 'All') return true;
        return raga.style === styleFilter;
      })
      .filter(raga => 
        raga.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [ragas, searchTerm, styleFilter]);

  return (
    <aside className="h-full flex flex-col bg-slate-800/50 border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <input
          type="text"
          placeholder="Search for a raga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-slate-200 placeholder-slate-400 rounded-md p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex justify-around mt-4">
          {(['All', RagaStyle.Hindustani, RagaStyle.Carnatic] as const).map(style => (
            <button
              key={style}
              onClick={() => setStyleFilter(style)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                styleFilter === style 
                ? 'bg-orange-500 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      <ul className="overflow-y-auto p-4 space-y-3 flex-grow">
        {filteredRagas.length > 0 ? (
          filteredRagas.map(raga => (
            <RagaListItem
              key={raga.id}
              raga={raga}
              onActivate={() => onActivateRaga(raga)}
              onSeek={onSeek}
              isActive={raga.id === activeRagaId}
              isPlaying={raga.id === playingRagaId}
              hasError={raga.id === audioErrorId}
              currentTime={raga.id === playingRagaId ? currentTime : 0}
              duration={raga.id === playingRagaId ? duration : 0}
            />
          ))
        ) : (
          <li className="text-center text-slate-400 mt-8">No ragas found.</li>
        )}
      </ul>
    </aside>
  );
};

export default RagaList;
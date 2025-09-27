import React from 'react';
import MusicNoteIcon from './icons/MusicNoteIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-700">
      <div className="container mx-auto flex items-center gap-3">
        <MusicNoteIcon className="w-8 h-8 text-orange-400" />
        <h1 className="text-3xl font-bold text-orange-400 tracking-wider font-serif">
          Raga Explorer
        </h1>
      </div>
    </header>
  );
};

export default Header;

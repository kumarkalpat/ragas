import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import RagaList from './components/RagaList';
import RagaDetail from './components/RagaDetail';
import { RAGAS } from './constants';
import { Raga } from './types';

const App: React.FC = () => {
  const [selectedRaga, setSelectedRaga] = useState<Raga | null>(null);
  const [playingRagaId, setPlayingRagaId] = useState<string | null>(null);
  const [audioErrorId, setAudioErrorId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSelectRaga = (raga: Raga) => {
    setSelectedRaga(raga);
  };
  
  const handleTogglePlay = async (raga: Raga) => {
    setAudioErrorId(null);
    if (!raga.audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    const isCurrentlyPlaying = playingRagaId === raga.id;

    if (isCurrentlyPlaying) {
      // If it's the same raga, just pause it.
      audio.pause();
      setPlayingRagaId(null);
    } else {
      // It's a new raga, or nothing is playing.
      // Ensure its details are selected.
      if (selectedRaga?.id !== raga.id) {
        setSelectedRaga(raga);
      }

      // If the audio source is not the correct one, update it and load.
      if (audio.src !== raga.audioUrl) {
        audio.src = raga.audioUrl;
        audio.load(); // Explicitly load the new source.
      }
      
      try {
        await audio.play();
        // Playback started successfully. Update the state.
        setPlayingRagaId(raga.id);
      } catch (error) {
        // Playback failed.
        console.error(`Audio play failed for raga ${raga.id}:`, error);
        setAudioErrorId(raga.id);
        setPlayingRagaId(null);
      }
    }
  };


  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleError = () => {
    if (playingRagaId) {
      console.error(`Failed to load audio for raga: ${playingRagaId}`);
      setAudioErrorId(playingRagaId);
      setPlayingRagaId(null); // Stop trying to play
      setCurrentTime(0);
      setDuration(0);
    }
  };

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
  
  const handlePauseMainAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingRagaId(null);
    }
  }

  useEffect(() => {
    // This effect ensures that if a raga is playing, its details are displayed.
    // It primarily handles cases where playback is initiated from a different
    // part of the app in the future.
    if(playingRagaId) {
        const raga = RAGAS.find(r => r.id === playingRagaId);
        if(raga && raga.id !== selectedRaga?.id) {
            setSelectedRaga(raga);
        }
    }
  }, [playingRagaId, selectedRaga?.id]); // Dependency array updated for correctness


  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 font-sans">
      <Header />
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingRagaId(null)} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
      />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
        <div className="md:col-span-1 lg:col-span-1 h-full overflow-y-auto">
          <RagaList
            ragas={RAGAS}
            onSelectRaga={handleSelectRaga}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
            activeRagaId={selectedRaga?.id || null}
            playingRagaId={playingRagaId}
            audioErrorId={audioErrorId}
            currentTime={currentTime}
            duration={duration}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3 h-full overflow-y-auto">
          <RagaDetail raga={selectedRaga} onCompositionPlay={handlePauseMainAudio} />
        </div>
      </div>
    </div>
  );
};

export default App;
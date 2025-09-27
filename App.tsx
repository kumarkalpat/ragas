import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import RagaList from './components/RagaList';
import RagaDetail from './components/RagaDetail';
import { RAGAS } from './constants';
import { Raga } from './types';
import { getAppConfig } from './services/geminiService';

const App: React.FC = () => {
  const [selectedRaga, setSelectedRaga] = useState<Raga | null>(null);
  const [playingRagaId, setPlayingRagaId] = useState<string | null>(null);
  const [audioErrorId, setAudioErrorId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Fetch the application config on startup to get the version.
    getAppConfig()
      .then(config => setAppVersion(config.version))
      .catch(err => {
        console.error("Failed to load app config:", err);
        setAppVersion('error');
      });
  }, []); // Empty dependency array ensures this runs only once on mount.

  const handleRagaActivation = (raga: Raga) => {
    const audio = audioRef.current;
    if (!audio || !raga.audioUrl) return;

    const isPlayingThisRaga = playingRagaId === raga.id;

    // Set the selected raga for the detail view immediately.
    if (selectedRaga?.id !== raga.id) {
      setSelectedRaga(raga);
    }
    setAudioErrorId(null);

    if (isPlayingThisRaga) {
      // If the clicked raga is already playing, pause it.
      audio.pause();
      setPlayingRagaId(null);
    } else {
      // If the source is different, update it and load it.
      // This is crucial for switching between different tracks.
      if (audio.src !== raga.audioUrl) {
          audio.src = raga.audioUrl;
          audio.load();
      }
      
      // Use the promise returned by play() to handle success and failure.
      // This is the most robust way to deal with browser autoplay policies.
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Playback started successfully.
          setPlayingRagaId(raga.id);
        }).catch(error => {
          // Autoplay was prevented or another error occurred.
          console.error(`Audio play failed for raga ${raga.id}:`, error);
          setAudioErrorId(raga.id);
          setPlayingRagaId(null);
        });
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
      setPlayingRagaId(null);
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
            onActivateRaga={handleRagaActivation}
            onSeek={handleSeek}
            activeRagaId={selectedRaga?.id || null}
            playingRagaId={playingRagaId}
            audioErrorId={audioErrorId}
            currentTime={currentTime}
            duration={duration}
            version={appVersion}
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
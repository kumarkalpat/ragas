import React, { useState, useEffect } from 'react';
import { Raga } from '../types';
import { getRagaExplanation, explanationCache } from '../services/geminiService';
import MediaModal from './MediaModal';
import PlayIcon from './icons/PlayIcon';

interface RagaDetailProps {
  raga: Raga | null;
  onCompositionPlay: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">{label}</h3>
      <p className="text-slate-300 text-lg">{value}</p>
    </div>
  );
};

const RagaDetail: React.FC<RagaDetailProps> = ({ raga, onCompositionPlay }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (raga) {
      // Check cache synchronously for an instant update.
      if (explanationCache.has(raga.id)) {
        setExplanation(explanationCache.get(raga.id)!);
        setIsLoading(false);
        setError('');
      } else {
        // If not in cache, fetch from the API.
        const generateExplanation = async () => {
          setIsLoading(true);
          setError('');
          setExplanation(''); // Clear previous explanation while loading.
          try {
            const result = await getRagaExplanation(raga);
            setExplanation(result);
          } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
          } finally {
            setIsLoading(false);
          }
        };
        generateExplanation();
      }
    } else {
      // Clear state if no raga is selected
      setExplanation('');
      setError('');
      setIsLoading(false);
    }
  }, [raga]);

  const handleCompositionClick = (url: string) => {
    onCompositionPlay(); // Pause main audio
    setModalUrl(url);
  };


  if (!raga) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p className="text-xl">Select a Raga from the list to begin exploring.</p>
      </div>
    );
  }

  return (
    <main className="overflow-y-auto p-6 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
        {raga.name}
        <span className="font-normal text-xl text-slate-400"> - {raga.description}</span>
      </h2>

      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        {explanation && <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{explanation}</p>}
        {isLoading && <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-t-transparent border-orange-400 rounded-full animate-spin"></div>
            <span>Generating explanation...</span>
        </div>}
        {error && <p className="text-red-400">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <DetailItem label="Style" value={raga.style} />
        <DetailItem label={raga.style === 'Hindustani' ? 'Thaat' : 'Melakarta'} value={raga.thaat || raga.melakarta} />
        <DetailItem label="Time" value={raga.time} />
        <DetailItem label="Period" value={raga.period} />
        <DetailItem label="Vadi (Dominant)" value={raga.vadi} />
        <DetailItem label="Samvadi (Sub-dominant)" value={raga.samvadi} />
        <DetailItem label="Aroha (Ascent)" value={raga.aroha} />
        <DetailItem label="Avaroha (Descent)" value={raga.avaroha} />
        {raga.pakad && <DetailItem label="Pakad (Phrase)" value={raga.pakad} />}
        
        {raga.originator && (
          <div className="md:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Originator / Promoter</h3>
            <p className="text-slate-300 text-lg">{raga.originator.name}</p>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{raga.originator.note}</p>
          </div>
        )}
      </div>
      
      {raga.compositions && raga.compositions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-400 mb-4">Famous Compositions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {raga.compositions.map((comp, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-left w-full flex flex-col"
              >
                <div className="flex justify-between items-start gap-3">
                  <p className="font-semibold text-slate-100 flex-grow">{comp.name}</p>
                  {comp.mediaUrl && (
                    <button 
                      onClick={() => handleCompositionClick(comp.mediaUrl!)}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-orange-400 transition-colors flex-shrink-0"
                      aria-label={`Play ${comp.name}`}
                    >
                      <PlayIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
                
                <div className="mt-3 flex-grow">
                  <p className="text-sm font-medium text-slate-300">
                    Composer: <span className="font-normal text-slate-400">{comp.composer.name}</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{comp.composer.bio}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {comp.composer.externalUrl && (
                    <a 
                      href={comp.composer.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-400 hover:text-orange-300 hover:underline"
                    >
                      Learn more about {comp.composer.name}
                    </a>
                  )}
                  {comp.mediaUrl && (
                     <a 
                      href={comp.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-400 hover:text-orange-300 hover:underline"
                    >
                      Video Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalUrl && <MediaModal url={modalUrl} onClose={() => setModalUrl(null)} />}
    </main>
  );
};

export default RagaDetail;
import React, { useEffect, useMemo } from 'react';
import CloseIcon from './icons/CloseIcon';

interface MediaModalProps {
  url: string;
  onClose: () => void;
}

const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  } catch (error) {
    console.error("Invalid URL for media modal:", error);
  }
  return null;
};


const MediaModal: React.FC<MediaModalProps> = ({ url, onClose }) => {
  const embedUrl = useMemo(() => getYoutubeEmbedUrl(url), [url]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!embedUrl) {
    // Silently fail if the URL is not a valid YouTube link
    // or call onClose to immediately dismiss the modal.
    console.warn(`Could not generate embed URL for: ${url}`);
    onClose();
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl aspect-video relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600"
          aria-label="Close video player"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <iframe
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default MediaModal;

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ImageOff, Maximize2 } from 'lucide-react';

interface Photo {
  src: string;
  credit: string;
  title?: string;
  color?: string;
}

const PHOTOS: Photo[] = [
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop', credit: 'Brooke Cagle', title: 'Lab Collaboration', color: '#06b6d4' },
  { src: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2000&auto=format&fit=crop', credit: 'Michelin', title: 'Campus Night', color: '#7c3aed' },
  { src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2000&auto=format&fit=crop', credit: 'Annie Spratt', title: 'Workshop', color: '#ef4444' },
  { src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop', credit: 'Priscilla Du Preez', title: 'Group Study', color: '#f97316' },
  { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop', credit: 'Prateek Katyal', title: 'Hackathon', color: '#06b6d4' },
  { src: 'https://images.unsplash.com/photo-1505672678657-cc7037095e0f?q=80&w=2000&auto=format&fit=crop', credit: 'ThisisEngineering', title: 'Presentation', color: '#10b981' },
  { src: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=2000&auto=format&fit=crop', credit: 'Hal Gatewood', title: 'Networking', color: '#0ea5e9' },
  { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop', credit: 'Alex Knight', title: 'Field Trip', color: '#8b5cf6' },
  { src: 'https://images.unsplash.com/photo-1532619675605-6993f69a4b3c?q=80&w=2000&auto=format&fit=crop', credit: 'Christina', title: 'Lab Equipment', color: '#f43f5e' },
  { src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=2000&auto=format&fit=crop', credit: 'Alok', title: 'Lecture Hall', color: '#06b6d4' },
  { src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop', credit: 'Jenny Ueberberg', title: 'Study Group', color: '#fb7185' },
  { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop', credit: 'Mikael Kristenson', title: 'Seminar', color: '#60a5fa' },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop', credit: 'Christina @ wocintechchat.com', title: 'Computer Lab', color: '#34d399' },
  { src: 'https://images.unsplash.com/photo-1534751516642-a1af1ef76d92?q=80&w=2000&auto=format&fit=crop', credit: 'Andrew Neel', title: 'Poster Session', color: '#f59e0b' },
  { src: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=2000&auto=format&fit=crop', credit: 'Chris Barbalis', title: 'Robotics Demo', color: '#a78bfa' },
  { src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2000&auto=format&fit=crop', credit: 'Sincerely Media', title: 'Award Night', color: '#f87171' },
  { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop', credit: 'Priscilla Du Preez', title: 'Campus Walk', color: '#38bdf8' },
];

const GRID_COLS = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5';

const DepartmentGallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [showInfo, setShowInfo] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number>(0);

  const handleImageLoad = useCallback((i: number) => {
    setLoadedImages(prev => new Set(prev).add(i));
  }, []);

  const handleImageError = useCallback((i: number) => {
    setFailedImages(prev => new Set(prev).add(i));
  }, []);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null));
  }, []);

  const next = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i + 1) % PHOTOS.length : null));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, prev, next]);

  const toggleInfo = useCallback((i: number) => {
    setShowInfo(prev => ({ ...prev, [i]: !prev[i] }));
  }, []);

  const lightboxPhoto = lightboxIndex !== null ? PHOTOS[lightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="rounded-2xl p-8 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Department Gallery
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {PHOTOS.length} photos capturing department life, events, and collaboration.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 bg-white/60 dark:bg-gray-800/40 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <Maximize2 size={14} />
            <span>Click any photo to view</span>
          </div>
        </div>
      </header>

      {/* Photo Grid */}
      <section>
        <div className={`grid ${GRID_COLS} gap-3 md:gap-4`}>
          {PHOTOS.map((p, i) => {
            const loaded = loadedImages.has(i);
            const failed = failedImages.has(i);
            const infoOpen = showInfo[i];

            return (
              <div
                key={`${i}-${p.src}`}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                style={{ aspectRatio: '4/3' }}
                onClick={() => !failed && openLightbox(i)}
                onMouseEnter={() => !failed && setShowInfo(prev => ({ ...prev, [i]: true }))}
                onMouseLeave={() => !failed && setShowInfo(prev => ({ ...prev, [i]: false }))}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                  if (!failed) toggleInfo(i);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' && !failed) openLightbox(i); }}
                aria-label={p.title || `Photo ${i + 1}`}
              >
                {/* Skeleton placeholder */}
                {!loaded && !failed && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                )}

                {/* Failed image fallback */}
                {failed ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800">
                    <ImageOff size={24} />
                    <span className="text-xs">Failed to load</span>
                  </div>
                ) : (
                  <img
                    src={p.src}
                    alt={p.title || `Photo ${i + 1}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(i)}
                    onError={() => handleImageError(i)}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                )}

                {/* Gradient overlay (always visible on mobile, on hover on desktop) */}
                {!failed && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />

                    {/* Accent bar */}
                    <div
                      style={{ background: p.color || '#06b6d4' }}
                      className="absolute top-3 left-3 w-8 h-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Info overlay - visible on hover (desktop) or tap (mobile) */}
                    <div
                      className={`absolute left-3 right-3 bottom-3 transition-all duration-300 ${
                        infoOpen
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}
                    >
                      {p.title && (
                        <div className="text-sm font-semibold text-white drop-shadow-md truncate">{p.title}</div>
                      )}
                      <div className="text-[11px] text-gray-200 drop-shadow-sm truncate">{p.credit}</div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={closeLightbox}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(diff) > 60) {
              diff > 0 ? prev() : next();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/50 text-white/80 text-xs font-medium backdrop-blur-sm">
            {lightboxIndex! + 1} / {PHOTOS.length}
          </div>

          {/* Previous */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 z-10 p-2.5 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Image container */}
          <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.title || 'Photo'}
              className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 z-10 p-2.5 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>

          {/* Bottom caption */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-center max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxPhoto.title && (
              <div className="text-sm font-semibold text-white">{lightboxPhoto.title}</div>
            )}
            <div className="text-[11px] text-gray-300 flex items-center justify-center gap-3 mt-0.5">
              <span>{lightboxPhoto.credit}</span>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(lightboxPhoto.src, '_blank', 'noopener'); }}
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                aria-label="Open original in new tab"
              >
                <Download size={12} />
                Original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentGallery;

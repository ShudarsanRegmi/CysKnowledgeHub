import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const PHOTOS: Array<{ src: string; credit: string; title?: string; color?: string }> = [
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
  // Additional images
  { src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop', credit: 'Jenny Ueberberg', title: 'Study Group', color: '#fb7185' },
  { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop', credit: 'Mikael Kristenson', title: 'Seminar', color: '#60a5fa' },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop', credit: 'Christina @ wocintechchat.com', title: 'Computer Lab', color: '#34d399' },
  { src: 'https://images.unsplash.com/photo-1534751516642-a1af1ef76d92?q=80&w=2000&auto=format&fit=crop', credit: 'Andrew Neel', title: 'Poster Session', color: '#f59e0b' },
  { src: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=2000&auto=format&fit=crop', credit: 'Chris Barbalis', title: 'Robotics Demo', color: '#a78bfa' },
  { src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2000&auto=format&fit=crop', credit: 'Sincerely Media', title: 'Award Night', color: '#f87171' },
  { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop', credit: 'Priscilla Du Preez', title: 'Campus Walk', color: '#38bdf8' },
];

const layoutPattern = [
  { col: 1, row: 2 },
  { col: 1, row: 1 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 2, row: 2 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
];

const DepartmentGallery: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open !== null) setIndex(open);
  }, [open]);

  const prev = useCallback(() => setIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % PHOTOS.length), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl p-6 bg-gradient-to-br from-pink-900/6 to-cyan-900/6 border border-white/6">
        <h1 className="text-3xl font-extrabold">Department Gallery</h1>
        <p className="text-gray-300 mt-1">A colorful collage of department life — interactive tiles with depth and motion.</p>
      </header>

      <section>
        <div className="grid grid-cols-6 gap-4 auto-rows-fr">
          {PHOTOS.map((p, i) => {
            const pat = layoutPattern[i % layoutPattern.length];
            const style: React.CSSProperties = { gridColumn: `span ${pat.col}`, gridRow: `span ${pat.row}` };
            return (
              <div
                key={p.src}
                style={style}
                className="relative overflow-hidden rounded-3xl transform transition-all duration-500 hover:scale-[1.03] hover:rotate-[0.3deg] shadow-2xl cursor-pointer"
                onClick={() => setOpen(i)}
              >
                <img src={p.src} alt={p.title} loading="lazy" className="w-full h-full object-cover block" />

                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.28),rgba(0,0,0,0.08))] opacity-0 hover:opacity-100 transition-opacity" />

                <div className="absolute left-4 bottom-4 text-white opacity-0 hover:opacity-100 transition-all">
                  <div className="text-base font-semibold drop-shadow-md">{p.title}</div>
                  <div className="text-xs text-gray-200 mt-1">{p.credit}</div>
                </div>

                {/* colorful accent */}
                <div style={{ background: p.color }} className="absolute top-4 left-4 w-12 h-1.5 rounded-full opacity-80" />
              </div>
            );
          })}
        </div>
      </section>

      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85">
          <button onClick={() => setOpen(null)} className="absolute top-6 right-6 p-2 rounded-full bg-gray-900/60 text-white">
            <X className="w-5 h-5" />
          </button>

          <button onClick={() => { prev(); setOpen((s) => (s === null ? null : (s - 1 + PHOTOS.length) % PHOTOS.length)); }} className="absolute left-6 p-2 rounded-full bg-gray-900/40 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-[92vw] max-h-[86vh] flex items-center justify-center">
            <div className="relative">
              <img src={PHOTOS[index].src} alt={PHOTOS[index].title} className="max-h-[86vh] max-w-[92vw] rounded-2xl shadow-2xl object-contain" />
              <button onClick={() => window.open(PHOTOS[index].src, '_blank', 'noopener')} className="absolute right-4 bottom-4 bg-gray-900/60 text-white px-3 py-2 rounded-md flex items-center gap-2">
                <Download className="w-4 h-4" />
                Open image
              </button>
            </div>
          </div>

          <button onClick={() => { next(); setOpen((s) => (s === null ? null : (s + 1) % PHOTOS.length)); }} className="absolute right-6 p-2 rounded-full bg-gray-900/40 text-white">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-300">
            {PHOTOS[index].title} — <span className="text-xs text-gray-400">{PHOTOS[index].credit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentGallery;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, PlayCircle, ShieldCheck, Folder } from 'lucide-react';

export default function VideoHub() {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState<'tutorials' | 'reels' | 'vault'>('tutorials');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSort, setCurrentSort] = useState('newest');
    const [activeTopic, setActiveTopic] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    const [subUrl, setSubUrl] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [subAuthor, setSubAuthor] = useState('');
    const [subTag, setSubTag] = useState('Network');
    const [subDesc, setSubDesc] = useState('');

    const [dbVideos, setDbVideos] = useState<any[]>([]);
    const [myVaultIds, setMyVaultIds] = useState<string[]>([]);
    const [myUpvotedIds, setMyUpvotedIds] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/videos')
            .then(res => res.json())
            .then(data => { if(Array.isArray(data)) setDbVideos(data); })
            .catch(err => console.error("Error fetching from MongoDB:", err));

        setMyVaultIds(JSON.parse(localStorage.getItem('cyberShield_vault') || '[]'));
        setMyUpvotedIds(JSON.parse(localStorage.getItem('cyberShield_upvotes') || '[]'));
    }, []);

    const handleLabSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Please sign in first!");
        
        let videoId = null;
        let isShort = false;

        if (subUrl.includes('/shorts/')) {
            isShort = true;
            videoId = subUrl.split('/shorts/')[1].substring(0, 11);
        } else {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = subUrl.match(regExp);
            videoId = (match && match[2].length === 11) ? match[2] : null;
        }

        if (!videoId || videoId.length !== 11) return alert("Invalid YouTube URL.");

        const newLab = {
            video_id: videoId,
            category: isShort ? "Reel" : "Tutorial", 
            tag: subTag,
            title: subTitle,
            description: subDesc,
            author: subAuthor || user.displayName || 'Student',
            author_id: user.uid,
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:5000/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLab)
            });

            if (response.ok) {
                const savedLab = await response.json();
                setDbVideos([savedLab, ...dbVideos]);
                alert(`✅ ${isShort ? 'Quick Exploit' : 'Lab Demo'} submitted to Admin Queue!`);
                setIsSubmitModalOpen(false);
                setSubUrl(''); setSubTitle(''); setSubAuthor(''); setSubDesc('');
            }
        } catch (error) {
            alert("❌ Server connection error.");
        }
    };

    const toggleVault = (id: string) => {
        const updated = myVaultIds.includes(id) ? myVaultIds.filter(v => v !== id) : [...myVaultIds, id];
        setMyVaultIds(updated);
        localStorage.setItem('cyberShield_vault', JSON.stringify(updated));
    };

    const toggleUpvote = (id: string) => {
        const updated = myUpvotedIds.includes(id) ? myUpvotedIds.filter(v => v !== id) : [...myUpvotedIds, id];
        setMyUpvotedIds(updated);
        localStorage.setItem('cyberShield_upvotes', JSON.stringify(updated));
    };

    const getTotalUpvotes = (video: any) => myUpvotedIds.includes(video.video_id) ? (video.base_upvotes || 0) + 1 : (video.base_upvotes || 0);

    const filteredVideos = dbVideos.filter(video => {
        if (video.status === 'pending') return false; 
        if (currentView === 'vault' && !myVaultIds.includes(video.video_id)) return false;
        if (currentView !== 'vault' && video.category !== (currentView === 'tutorials' ? 'Tutorial' : 'Reel')) return false;
        if (activeTopic !== 'All' && video.tag !== activeTopic) return false;
        if (searchQuery && !`${video.title} #${video.tag} ${video.author}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    }).sort((a, b) => {
        if (currentSort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return getTotalUpvotes(b) - getTotalUpvotes(a);
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-white min-h-[80vh] font-sans">
            
            {/* Top Controls Container - Centered to match design */}
            <div className="flex flex-wrap justify-center items-stretch gap-4 mb-10">
                
                {/* Search Bar */}
                <div className="relative w-72">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-80">🔍</span>
                    <input 
                        type="text" 
                        className="w-full h-full bg-[#0a0f1c] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 focus:border-cyan-400 focus:outline-none placeholder-gray-400" 
                        placeholder="Search labs or tags..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>

                {/* Sort Dropdown */}
                <select 
                    className="bg-[#0a0f1c] border border-slate-700 rounded-xl py-3 px-5 text-sm text-gray-200 focus:border-cyan-400 focus:outline-none cursor-pointer" 
                    value={currentSort} 
                    onChange={(e) => setCurrentSort(e.target.value)}
                >
                    <option value="newest">📅 Newest</option>
                    <option value="top">🛡️ Top Rated</option>
                </select>

                {/* Submit Demo Button */}
                <button 
                    className="bg-gradient-to-r from-[#14b8a6] to-[#8b5cf6] hover:opacity-90 font-bold px-6 py-2 rounded-xl transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2" 
                    onClick={() => user ? setIsSubmitModalOpen(true) : alert("🔒 Please sign in to submit a demo!")}
                >
                    <span className="text-xl font-light leading-none text-white/80">+</span>
                    <span className="text-sm leading-tight text-left text-white">Submit<br/>Demo</span>
                </button>
            </div>

            {/* Pill Tabs Switcher */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex items-center bg-transparent border border-slate-700 rounded-full p-1 w-full max-w-2xl shadow-lg shadow-black/20">
                    <button 
                        className={`flex-1 py-3 text-center text-sm font-bold uppercase rounded-full transition-all duration-300 ${currentView === 'tutorials' ? 'bg-gradient-to-r from-[#14b8a6] to-[#8b5cf6] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`} 
                        onClick={() => setCurrentView('tutorials')}
                    >
                        🧪 LABS
                    </button>
                    <button 
                        className={`flex-1 py-3 text-center text-sm font-bold uppercase rounded-full transition-all duration-300 ${currentView === 'reels' ? 'bg-gradient-to-r from-[#14b8a6] to-[#8b5cf6] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`} 
                        onClick={() => setCurrentView('reels')}
                    >
                        ⚡ QUICK EXPLOITS
                    </button>
                    <button 
                        className={`flex-1 py-3 text-center text-sm font-bold uppercase rounded-full transition-all duration-300 ${currentView === 'vault' ? 'bg-gradient-to-r from-[#14b8a6] to-[#8b5cf6] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`} 
                        onClick={() => setCurrentView('vault')}
                    >
                        📁 VAULT
                    </button>
                </div>
            </div>

            {/* Video Grid or Empty State */}
            {filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-xl font-semibold text-slate-400 mb-2">No videos found</p>
                    <p className="text-sm text-slate-500">Submit a new demo or adjust your search filters!</p>
                </div>
            ) : (
                <div className={`grid gap-6 mb-16 ${currentView === 'reels' ? 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'}`}>
                    {filteredVideos.map((video, idx) => (
                        <div className="group bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-400 transition-all hover:-translate-y-1" key={idx} onClick={() => setSelectedVideo(video)}>
                            <div className={`relative overflow-hidden bg-black ${currentView === 'reels' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                                <img src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`} alt="thumb" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-cyan-500/20 p-4 rounded-full backdrop-blur-sm border border-cyan-500/50">
                                        <PlayCircle className="w-8 h-8 text-cyan-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <span className="text-xs text-cyan-400 font-bold bg-cyan-900/40 px-2 py-1 rounded-full mb-2 inline-block">#{video.tag}</span>
                                <h3 className="text-lg font-bold mb-2 truncate">{video.title}</h3>
                                <div className="flex justify-between text-sm text-slate-400">
                                    <span>{video.author}</span>
                                    <span>🛡️ {getTotalUpvotes(video)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedVideo(null); }}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden relative shadow-2xl">
                        <button className="absolute top-4 right-4 z-10 text-white bg-slate-800 hover:bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors" onClick={() => setSelectedVideo(null)}>X</button>
                        <div className="aspect-video bg-black"><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1`} allowFullScreen></iframe></div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">{selectedVideo.title}</h2>
                            <p className="text-slate-300 mb-6">{selectedVideo.description}</p>
                            <div className="flex gap-4">
                                <button className="border border-cyan-500 text-cyan-400 px-4 py-2 rounded-xl font-bold hover:bg-cyan-900/30 transition-colors" onClick={() => toggleUpvote(selectedVideo.video_id)}>🛡️ {getTotalUpvotes(selectedVideo)} Upvotes</button>
                                <button className="border border-purple-500 text-purple-400 px-4 py-2 rounded-xl font-bold hover:bg-purple-900/30 transition-colors" onClick={() => toggleVault(selectedVideo.video_id)}>{myVaultIds.includes(selectedVideo.video_id) ? 'Saved' : 'Save to Vault'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsSubmitModalOpen(false); }}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-6">🚀 Submit Lab Demo</h2>
                        <form onSubmit={handleLabSubmit} className="flex flex-col gap-4">
                            <input type="url" required placeholder="YouTube URL" className="p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm" value={subUrl} onChange={e => setSubUrl(e.target.value)} />
                            <input type="text" required placeholder="Lab Title" className="p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm" value={subTitle} onChange={e => setSubTitle(e.target.value)} />
                            <div className="flex gap-4">
                                <input type="text" required placeholder="Your Name" className="p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none flex-1 text-sm" value={subAuthor} onChange={e => setSubAuthor(e.target.value)} />
                                <select className="p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none flex-1 text-sm" value={subTag} onChange={e => setSubTag(e.target.value)}>
                                    <option value="Network">Network Security</option>
                                    <option value="WebApp">Web App</option>
                                    <option value="Architecture">Architecture</option>
                                    <option value="Cryptography">Cryptography</option>
                                </select>
                            </div>
                            <textarea required rows={3} placeholder="Description" className="p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm resize-none" value={subDesc} onChange={e => setSubDesc(e.target.value)}></textarea>
                            <button type="submit" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white font-bold py-3 rounded-xl mt-2 transition-opacity shadow-lg shadow-purple-900/20">Broadcast to Hub</button>
                            <button type="button" className="text-slate-400 mt-2 hover:text-white transition-colors text-sm" onClick={() => setIsSubmitModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
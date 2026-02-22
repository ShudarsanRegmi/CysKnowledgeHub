
import React, { useRef, useEffect, useState } from 'react';
import { Shield, BookOpen, Map, Award, Terminal, Briefcase, Menu, X, Github, UserCircle, LogOut, Cpu, Building2, ChevronDown, FileBadge } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Close user-menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'ctf', label: 'CTF Guides', icon: Terminal },
    { id: 'roadmaps', label: 'Roadmaps', icon: Map },
    { id: 'projects', label: 'Projects', icon: Github },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'experiments', label: 'Experiments', icon: Cpu },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'certifications', label: 'Certifications', icon: FileBadge },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Shield className="w-8 h-8 text-cyan-500" />
            <span className="text-xl font-bold tracking-tight mono">CYBER<span className="text-cyan-500">SHIELD</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${activeTab === item.id ? 'text-cyan-500' : 'text-gray-400'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Profile / Auth button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? 'avatar'} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-cyan-400" />
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-200 max-w-[120px] truncate">
                    {user.displayName ?? user.email}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm font-semibold text-white truncate">{user.displayName ?? 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={async () => { setShowUserMenu(false); await signOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors"
              >
                <UserCircle className="w-5 h-5" />
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-950/95 pt-20">
          <nav className="flex flex-col items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`text-2xl font-bold flex items-center gap-3 ${activeTab === item.id ? 'text-cyan-500' : 'text-gray-400'
                  }`}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-cyan-500" />
              <span className="text-lg font-bold mono">CYBERSHIELD</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              The official knowledge repository of the Department Cybersecurity Cell.
              Dedicated to building the next generation of digital defenders.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setActiveTab('blogs')} className="hover:text-cyan-400">Security Blogs</button></li>
              <li><button onClick={() => setActiveTab('ctf')} className="hover:text-cyan-400">CTF Guides</button></li>
              <li><button onClick={() => setActiveTab('roadmaps')} className="hover:text-cyan-400">Roadmaps</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contribute</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-cyan-400">Submit Project</button></li>
              <li><button className="hover:text-cyan-400">Share Interview Exp</button></li>
              <li><button className="hover:text-cyan-400">CMS Login</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Department Cybersecurity Hub. Securely built for hackers.
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Layout;

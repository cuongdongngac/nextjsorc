import { Settings, Key, LogOut, BookOpen, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onOpenSettings?: () => void;
  onClearKey?: () => void;
  hasApiKey?: boolean;
}

export default function Header({ onOpenSettings, onClearKey, hasApiKey }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between print-hidden">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent select-none">
            Looking-Back-OCR
          </span>
        </Link>
        
        {/* Menu Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link 
            href="/" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <Home size={16} /> Công cụ
          </Link>
          <Link 
            href="/huong-dan" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === '/huong-dan' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <BookOpen size={16} /> Hướng dẫn
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {onOpenSettings && (
          <>
            <div className="hidden sm:flex items-center bg-slate-900 border border-sky-500/30 rounded-full px-3 py-1 gap-1.5 mr-2">
              <span className="text-xs font-semibold text-sky-400">OpenRouter</span>
            </div>

            {hasApiKey && onClearKey && (
              <button
                onClick={onClearKey}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-full text-xs font-medium transition-colors"
                title="Xóa API Key hiện tại"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Xóa Key</span>
              </button>
            )}

            <button 
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium transition-colors"
            >
              {hasApiKey ? (
                <>
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="hidden sm:inline">Đã cấu hình API</span>
                  <span className="sm:hidden">API OK</span>
                </>
              ) : (
                <>
                  <Key size={14} />
                  <span className="hidden sm:inline">Cấu hình API Key</span>
                  <span className="sm:hidden">API Key</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

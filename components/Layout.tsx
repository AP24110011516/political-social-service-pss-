
import React from 'react';
import { LayoutDashboard, MessageSquare, User, Activity, LogOut, Bell, ExternalLink, Menu, X } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Language } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { t, language, setLanguage } = useTranslation();

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'issues', label: t('feed'), icon: MessageSquare },
    { id: 'performance', label: t('analytics'), icon: Activity },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* UX4G Official Top Bar */}
      <div className="gov-top-bar py-1.5 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <span className="text-gov-blue">{language === 'en' ? 'भारत सरकार' : t('govIndia')}</span> | {t('govIndia')}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button className="hover:text-slate-900 transition-colors">Screen Reader Access</button>
          <div className="flex items-center gap-2">
            <button className="w-6 h-6 border border-slate-300 rounded text-[10px] flex items-center justify-center font-bold hover:bg-white">A-</button>
            <button className="w-6 h-6 border border-slate-300 rounded text-[10px] flex items-center justify-center font-bold hover:bg-white">A</button>
            <button className="w-6 h-6 border border-slate-300 rounded text-[10px] flex items-center justify-center font-bold hover:bg-white">A+</button>
          </div>
          <select 
            value={language}
            onChange={handleLanguageChange}
            className="bg-transparent border-none text-[11px] font-bold focus:ring-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>

      {/* Main Official Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="National Emblem" 
              className="h-14 w-auto" 
            />
            <div className="border-l border-slate-200 pl-4">
              <h1 className="text-xl font-bold tracking-tight text-[#003366] leading-none mb-1 uppercase">{t('portalName')}</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">{t('deptName')}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-100 text-[#003366]' 
                    : 'text-slate-600 hover:text-[#003366] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title={t('logout')}
            >
              <LogOut size={20} />
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[105px] bg-white z-40 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium ${
                  activeTab === tab.id ? 'bg-slate-100 text-gov-blue' : 'text-slate-600'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-3 text-red-600 font-medium flex items-center gap-3"
            >
              <LogOut size={20} />
              {t('logout')}
            </button>
          </div>
        </div>
      )}

      {/* Content Container */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 pb-24 lg:pb-8">
        <nav className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-6">
          <span className="hover:text-gov-blue cursor-pointer">Portal</span>
          <span>/</span>
          <span className="text-slate-600">
            {tabs.find(t => t.id === activeTab)?.label || t('dashboard')}
          </span>
        </nav>
        {children}
      </main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-gov-blue mb-4">{t('portalName')} Portal</h4>
            <p className="text-slate-500 leading-relaxed">
              An official initiative for unified grievance redressal and transparent local governance across the Republic of India.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gov-blue mb-4">Important Links</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-1 hover:text-gov-blue cursor-pointer"><ExternalLink size={12} /> Privacy Policy</li>
              <li className="flex items-center gap-1 hover:text-gov-blue cursor-pointer"><ExternalLink size={12} /> Terms of Service</li>
              <li className="flex items-center gap-1 hover:text-gov-blue cursor-pointer"><ExternalLink size={12} /> Contact Nodal Officer</li>
            </ul>
          </div>
          <div className="flex flex-col items-start md:items-end">
             <div className="flex gap-4 mb-4 grayscale opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/en/9/95/Digital_India_logo.svg" alt="Digital India" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/84/G20_India_2023_logo.svg/1200px-G20_India_2023_logo.svg.png" alt="G20" className="h-10" />
             </div>
             <p className="text-xs text-slate-400">© 2026 Government of India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

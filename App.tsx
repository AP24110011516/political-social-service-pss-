
import React, { useState, useEffect, useCallback } from 'react';
import AadhaarLogin from './components/Auth/AadhaarLogin';
import Layout from './components/Layout';
import IssueCard from './components/Issue/IssueCard';
import IssueForm from './components/Issue/IssueForm';
import CivicScoreDashboard from './components/Dashboard/CivicScoreDashboard';
import { api } from './services/api';
import { Issue, User } from './types';
import { Plus, Sparkles, Filter, Search, Activity, RefreshCw, AlertCircle, User as UserIcon } from 'lucide-react';
import { useTranslation } from './context/LanguageContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Initial Fetch
  useEffect(() => {
    const savedUser = localStorage.getItem('civic_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('civic_user');
      }
    }
  }, []);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.issues.getAll();
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user, fetchIssues]);

  const handleLogin = async (userData: any) => {
    setLoginError(null);
    try {
      const authenticatedUser = await api.auth.login(userData.aadhaarNumber);
      setUser(authenticatedUser);
      localStorage.setItem('civic_user', JSON.stringify(authenticatedUser));
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.response?.data?.message || "Authentication service is temporarily unavailable. Please try again later.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('civic_user');
  };

  const addIssue = async (formData: any) => {
    try {
      const newIssue = await api.issues.create({
        ...formData,
        location: user?.location,
        authorId: user?.id,
        authorName: user?.name,
      });
      setIssues(prev => [newIssue, ...prev]);
      setShowIssueForm(false);
    } catch (error) {
      console.error("Failed to create issue");
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const updated = await api.issues.upvote(id);
      setIssues(prev => prev.map(i => i.id === id ? updated : i));
    } catch (error) {
      console.error("Upvote failed");
    }
  };

  const generateInsights = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const { insights } = await api.analytics.getTrends();
      setAiInsights(insights);
    } catch (error) {
      setAiInsights("AI Analysis service is currently offline. Please connect to a live backend to enable this feature.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  if (!user) {
    return (
      <div className="relative">
        <AadhaarLogin onLogin={handleLogin} />
        {loginError && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 animate-in slide-in-from-bottom-2">
            <div className="bg-red-600 text-white p-4 rounded-lg shadow-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{loginError}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-[#003366] tracking-tight">{t('dashboard')}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('welcome')}, {user.name} | UID: ****{user.aadhaarNumber.slice(-4)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchIssues}
                  className="p-2 bg-white border border-slate-200 text-slate-400 rounded-md hover:text-gov-blue hover:border-gov-blue transition-all"
                  title="Force Sync"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => setShowIssueForm(true)}
                  className="shadcn-button-primary px-5 py-2 text-sm flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} />
                  {t('newGrievance')}
                </button>
              </div>
            </header>

            <CivicScoreDashboard />

            <section className="bg-white border border-gov-blue/20 rounded-lg p-6 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-gov-blue rounded-md border border-blue-100">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-gov-blue uppercase tracking-wider">{t('aiInsights')}</h3>
                    <span className="text-[9px] font-bold bg-gov-blue text-white px-1.5 py-0.5 rounded tracking-tighter uppercase">Experimental</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-3xl">
                    {aiInsights || "Generate a comprehensive analysis of grievances in your village to identify systemic infrastructure gaps."}
                  </p>
                  <button
                    onClick={generateInsights}
                    disabled={isAnalyzing}
                    className="text-xs font-bold text-gov-blue flex items-center gap-2 hover:underline disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Consulting Gemini Pro 3...' : 'Generate Intelligence Report'}
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{t('recentActivity')}</h3>
                </div>
                <button className="text-gov-blue font-bold text-[11px] uppercase tracking-wider hover:underline" onClick={() => setActiveTab('issues')}>{t('feed')}</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.length > 0 ? (
                  issues.slice(0, 3).map(issue => (
                    <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
                  ))
                ) : (
                  [1,2,3].map(i => (
                    <div key={i} className="h-48 border border-slate-100 rounded-lg bg-white/50 animate-pulse"></div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6">
            <header className="pb-6 border-b border-slate-200">
              <h2 className="text-2xl font-extrabold text-[#003366] tracking-tight">{t('feed')}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Unified Record of Community Concerns</p>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full shadcn-input pl-10 text-sm h-10"
                />
              </div>
              <button className="h-10 px-4 border border-slate-200 rounded-md text-slate-600 flex items-center gap-2 text-sm font-medium hover:bg-slate-50 transition-colors">
                <Filter size={16} /> Filter Records
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
              <div className="lg:col-span-2 space-y-4">
                {isLoading && issues.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 font-medium italic">Establishing secure connection to database...</div>
                ) : (
                  issues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
                  ))
                )}
              </div>
              
              <aside className="space-y-6">
                <div className="shadcn-card p-5">
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{t('locationContext')}</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs text-slate-500">State</span>
                        <span className="text-xs font-bold text-gov-blue">{user.location.state}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs text-slate-500">Constituency</span>
                        <span className="text-xs font-bold text-gov-blue">{user.location.constituency}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs text-slate-500">Village/Ward</span>
                        <span className="text-xs font-bold text-gov-blue">{user.location.village}</span>
                      </div>
                   </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
           <div className="space-y-6">
              <header className="pb-6 border-b border-slate-200">
                <h2 className="text-2xl font-extrabold text-[#003366] tracking-tight">{t('analytics')}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Infrastructure Benchmarks & Analytics</p>
              </header>
              <div className="shadcn-card p-20 flex flex-col items-center text-center">
                 <Activity size={48} className="text-slate-200 mb-6" />
                 <h3 className="text-lg font-bold text-slate-700 mb-2">Data Processing in Progress</h3>
                 <p className="text-sm text-slate-400 max-w-sm">
                   Regional performance data is being synced from SQL servers. Real-time benchmarks will appear shortly.
                 </p>
              </div>
           </div>
        )}

        {activeTab === 'profile' && (
           <div className="max-w-2xl mx-auto pt-8">
             <div className="shadcn-card overflow-hidden">
                <div className="h-32 bg-slate-100 border-b border-slate-200 flex items-center justify-center">
                   <UserIcon size={48} className="text-slate-300" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{user.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">UID: **** **** {user.aadhaarNumber.slice(-4)}</p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Verification Status</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Aadhaar Verified</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Registered Mobile</span>
                      <span className="text-xs font-bold text-slate-700">{user.mobileNumber}</span>
                    </div>
                  </div>
                </div>
             </div>
           </div>
        )}
      </div>

      {showIssueForm && (
        <IssueForm
          onSubmit={addIssue}
          onClose={() => setShowIssueForm(false)}
        />
      )}
    </Layout>
  );
};

export default App;

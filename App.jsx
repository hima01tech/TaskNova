import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { 
  Plus, Search, CheckCircle2, Trash2, LogOut, 
  LayoutDashboard, ClipboardList, Filter, Loader2, X, 
  Settings, Bell, Calendar, ChevronRight, Hash, Clock,
  Sun, Moon, Sparkles, Trophy, Zap, MousePointer2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

/** * MOCK ENGINE & API CONFIG 
 */
const API_URL = 'http://localhost:5000/api';
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }), ...options.headers };
  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error');
    return data;
  } catch (err) {
    return handleMockRequest(endpoint, options);
  }
};

const handleMockRequest = (endpoint, options) => {
  const body = options.body ? JSON.parse(options.body) : null;
  const mockTasks = JSON.parse(localStorage.getItem('p_tasks') || '[]');
  if (endpoint.includes('auth')) return { token: 'mock', user: { id: '1', name: body?.name || 'Alex Morgan', email: body?.email } };
  if (endpoint === '/tasks' && options.method === 'POST') {
    const t = { ...body, _id: Date.now().toString(), status: 'Pending', createdAt: new Date().toISOString() };
    localStorage.setItem('p_tasks', JSON.stringify([t, ...mockTasks]));
    return t;
  }
  if (endpoint.startsWith('/tasks/') && options.method === 'PUT') {
    const id = endpoint.split('/').pop();
    const updated = mockTasks.map(t => t._id === id ? { ...t, ...body } : t);
    localStorage.setItem('p_tasks', JSON.stringify(updated));
    return updated.find(t => t._id === id);
  }
  if (endpoint.startsWith('/tasks/') && options.method === 'DELETE') {
    const updated = mockTasks.filter(t => !endpoint.includes(t._id));
    localStorage.setItem('p_tasks', JSON.stringify(updated));
    return { ok: true };
  }
  return mockTasks;
};

// Contexts
const AuthContext = createContext();
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Theme button removed, defaulting to dark theme for a premium look
  const [isDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <div className="min-h-screen bg-white dark:bg-[#050609] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden selection:bg-indigo-500/30 relative">
        {/* Background Image Layer */}
        <div 
          className="fixed inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none transition-opacity duration-700 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000")' }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const login = async (e, p) => {
    const d = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email: e, password: p }) });
    localStorage.setItem('user', JSON.stringify(d.user));
    setUser(d.user);
  };
  const logout = () => { setUser(null); localStorage.clear(); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Components
const NavItem = ({ icon: Icon, label, active = false }) => (
  <button 
    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group transform active:scale-95 ${
    active 
      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
  }`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
  </button>
);

const Badge = ({ status }) => {
  const isComp = status === 'Completed';
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border transition-colors duration-500 ${
      isComp 
        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
        : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isComp ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
      {status}
    </div>
  );
};

const AuthPage = ({ type, setType }) => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => { await login("test@test.com", "123"); setLoading(false); }, 1000);
  };

  const isLogin = type === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl border border-white dark:border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center rounded-3xl shadow-2xl mb-8">
              <ClipboardList className="text-white w-10 h-10" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-5xl font-black tracking-tighter mb-2 italic">TaskNova</h2>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-indigo-500">
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              <span>{isLogin ? 'Operational Node' : 'New Agent Registry'}</span>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={handleAuth}>
            {!isLogin && (
              <input className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="Full Name" type="text" required />
            )}
            <input className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="Agent ID / Email" type="email" required />
            <input className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="Password" type="password" required />
            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4.5 rounded-2xl shadow-xl flex items-center justify-center gap-3 mt-4 hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-95" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : isLogin ? 'Authorize' : 'Register Agent'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setType(isLogin ? 'register' : 'login')}
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '' });

  const load = async () => { 
    setLoading(true); 
    const d = await apiRequest('/tasks'); 
    setTasks(Array.isArray(d) ? d : []); 
    setLoading(false); 
  };
  
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(form) });
    setIsModal(false); setForm({ title: '', description: '' }); load();
  };

  const del = async (id) => { await apiRequest(`/tasks/${id}`, { method: 'DELETE' }); load(); };
  
  const toggleStatus = async (t) => { 
    const isNowCompleted = t.status !== 'Completed';
    if (isNowCompleted) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#4f46e5', '#8b5cf6', '#10b981'] });
    }
    await apiRequest(`/tasks/${t._id}`, { method: 'PUT', body: JSON.stringify({ status: isNowCompleted ? 'Completed' : 'Pending' }) }); 
    load(); 
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    return { total, completed, perc: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex font-sans min-h-screen animate-in fade-in duration-500">
      {/* Sidebar */}
      <aside className="w-80 bg-white/60 dark:bg-black/40 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 flex flex-col p-8 sticky top-0 h-screen hidden lg:flex">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg">
              <ClipboardList className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white italic uppercase">TaskNova</span>
          </div>
        </div>

        <nav className="space-y-2 mb-10">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] mb-6 ml-4">Main Ops</p>
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Calendar} label="Timeline" />
          <NavItem icon={Clock} label="Archive" />
          <NavItem icon={Settings} label="Protocols" />
        </nav>

        <div className="mt-auto">
          <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black shadow-lg">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.name || 'Lead Agent'}</p>
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active Session</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-2xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all duration-300">
              <LogOut className="w-4 h-4" /> Terminate
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 relative">
        <header className="lg:hidden flex items-center justify-between mb-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200 dark:border-white/5 sticky top-0 z-40 shadow-xl">
           <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-2 rounded-xl">
                <ClipboardList className="text-white w-4 h-4" />
             </div>
             <span className="font-black text-lg text-slate-900 dark:text-white italic uppercase">TaskNova</span>
           </div>
           <div className="flex items-center gap-3">
            <button onClick={logout} className="p-2.5 bg-red-500/10 text-red-500 rounded-2xl"><LogOut className="w-5 h-5" /></button>
           </div>
        </header>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 mb-4 tracking-[0.4em]">
              <Zap className="w-3 h-3 fill-current" /> <span>System Dashboard</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">Operations</h1>
            
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.completed}/{stats.total}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Sync</span>
              </div>
              <div className="flex flex-col flex-1 min-w-[120px]">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                  <span className="text-[10px] font-black text-indigo-500">{stats.perc}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${stats.perc}%` }} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setIsModal(true)} className="bg-indigo-600 text-white pl-8 pr-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-2xl transform hover:scale-105 active:scale-95">
            <Plus className="w-6 h-6" />
            <span className="text-lg uppercase">New Task</span>
          </button>
        </div>

        <div className="mb-16">
          <div className="relative max-w-2xl">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input className="w-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] pl-20 pr-8 py-6 outline-none text-xl font-bold dark:text-white transition-all focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300" placeholder="Filter registry..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="animate-spin text-indigo-600 w-12 h-12 mx-auto mb-4" />
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Syncing Nodes</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full bg-white/20 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[4rem] py-40 text-center">
              <h3 className="text-3xl font-black text-slate-300 dark:text-slate-700 uppercase italic">No Active Tasks</h3>
            </div>
          ) : (
            filtered.map(t => (
              <div key={t._id} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-white/10 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => del(t._id)} className="p-3 text-red-500 bg-red-500/10 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-5 mb-8">
                  <button onClick={() => toggleStatus(t)} className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${t.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-white/20 hover:border-indigo-500'}`}><CheckCircle2 className="w-5 h-5" /></button>
                  <Badge status={t.status} />
                </div>
                <h3 className={`text-2xl font-black mb-4 tracking-tight leading-[1.2] ${t.status === 'Completed' ? 'text-slate-300 dark:text-slate-700 line-through' : 'text-slate-900 dark:text-white'}`}>{t.title}</h3>
                <p className={`text-sm mb-10 leading-relaxed font-medium ${t.status === 'Completed' ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>{t.description}</p>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {isModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div onClick={() => setIsModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] p-12 border border-white dark:border-white/10 shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-500">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 italic uppercase">Deploy Task</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <input required className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-8 py-5 text-xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" />
              <textarea className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-8 py-6 text-lg font-medium dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 h-40 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModal(false)} className="flex-1 py-5 font-black text-slate-400 uppercase tracking-widest">Abort</button>
                <button className="flex-[2] bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl hover:bg-indigo-700 transition-all transform active:scale-95">Authorize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [authView, setAuthView] = useState('login');
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthRouter authView={authView} setAuthView={setAuthView} />
      </AuthProvider>
    </ThemeProvider>
  );
}

const AuthRouter = ({ authView, setAuthView }) => {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <AuthPage type={authView} setType={setAuthView} />;
}
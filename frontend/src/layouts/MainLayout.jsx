// src/layouts/MainLayout.jsx
import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Bell, Settings, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';

const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans selection:bg-blue-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Minimalist Top Header */}
                <header className="h-20 flex items-center justify-between px-10 shrink-0 z-30 bg-white border-b border-slate-100">
                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm chức năng..." 
                                className="w-64 pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-500/5 transition-all"
                            />
                        </div>
                        <div className="bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200/50">
                            <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">
                                PHÂN HỆ: <span className="text-slate-600">{user?.roles?.[0] || 'N/A'}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-xl transition-all relative group">
                            <Bell size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="w-px h-6 bg-slate-100"></div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 p-1.5 pr-4 hover:bg-slate-100 rounded-2xl transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-slate-300" />
                                    )}
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="text-sm font-black text-slate-800 leading-none mb-1">{user?.fullName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">ID: {user?.username}</p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                                    <div className="px-5 py-4 border-b border-slate-50 mb-2">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tài khoản cá nhân</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors font-bold"
                                    >
                                        <User size={18} className="text-slate-300" />
                                        <span>Hồ sơ cá nhân</span>
                                    </button>
                                    
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors font-bold">
                                        <Settings size={18} className="text-slate-300" />
                                        <span>Cấu hình tài khoản</span>
                                    </button>

                                    <div className="h-px bg-slate-50 my-2 mx-2"></div>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-black"
                                    >
                                        <LogOut size={18} />
                                        <span>ĐĂNG XUẤT HỆ THỐNG</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area with Soft Overlay */}
                <main className="flex-1 overflow-y-auto p-10 relative scroll-smooth">
                    {/* Subtle Ambient Background Gradients */}
                    <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-blue-50/30 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
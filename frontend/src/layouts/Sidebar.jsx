// src/layouts/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { MENU_ITEMS } from '../constants/menuConfig';

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    const filteredMenu = MENU_ITEMS.filter((item) =>
        item.roles.some((role) => user?.roles?.includes(role))
    );

    return (
        <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col h-screen shrink-0 z-40">
            {/* Branding - Matches Login Page Style */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <BookOpen className="text-slate-400" size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase">Dong A University</h2>
                    <p className="text-[12px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Danh mục chính</p>
                {filteredMenu.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon || BookOpen; // Fallback if no icon

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-500'}`}>
                                {item.icon ? <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} /> : <BookOpen size={20} />}
                            </span>
                            <span className="text-sm font-bold tracking-tight">{item.title}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-50">
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                        v1.2.0 • ACADEMIC
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
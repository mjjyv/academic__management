import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Bell, Settings } from 'lucide-react';
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

    // Close menu when clicking outside
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
        <div className="flex h-screen bg-[#FAFAFA] overflow-hidden font-sans">
            {/* Cột trái: Sidebar điều hướng */}
            <Sidebar />

            {/* Cột phải: Header + Nội dung chính */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Modern Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 h-16 flex items-center justify-between px-8 shrink-0 z-30 sticky top-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                PHÂN HỆ: {user?.roles?.[0] || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-6 w-px bg-gray-100 mx-1"></div>

                        {/* User Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-3 p-1.5 pr-3 hover:bg-gray-50 rounded-xl transition-all duration-200"
                            >
                                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">{user?.fullName}</p>
                                    <p className="text-[10px] text-gray-400 font-medium tracking-wide italic">@{user?.username}</p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fadeInScale z-50">
                                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tài khoản</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <User size={18} className="text-gray-400" />
                                        <span>Hồ sơ cá nhân</span>
                                    </button>
                                    
                                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                        <Settings size={18} className="text-gray-400" />
                                        <span>Cài đặt</span>
                                    </button>

                                    <div className="h-px bg-gray-50 my-1 mx-2"></div>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                    >
                                        <LogOut size={18} />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Vùng hiển thị Module Content */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-7xl mx-auto animate-fadeIn">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
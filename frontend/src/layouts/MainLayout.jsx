import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';

const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Cột trái: Sidebar điều hướng */}
            <Sidebar />

            {/* Cột phải: Header + Nội dung chính */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar: Thông tin User & Logout */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0 z-20">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                                Phân hệ: {user?.roles?.[0] || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                                {user?.fullName}
                            </p>
                            <p className="text-xs text-gray-500 font-medium italic">
                                @{user?.username}
                            </p>
                        </div>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm border border-red-100"
                        >
                            ĐĂNG XUẤT
                        </button>
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
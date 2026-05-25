import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { DASHBOARD_WIDGETS } from '../constants/dashboardConfig';
import { ChevronRight, Shield, Star, Clock, Bell, Settings, ArrowRight, LayoutDashboard, UserCheck } from 'lucide-react';

const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const primaryRole = user?.roles?.[0] || 'SINHVIEN';
    const widgets = DASHBOARD_WIDGETS[primaryRole] || [];

    const renderGreetingCard = () => {
        if (!user) return null;

        const roleConfigs = {
            ADMIN: { title: 'Hệ thống Quản trị Tập trung', roleName: 'Quản trị viên', gradient: 'from-slate-800 to-slate-900', icon: Shield },
            GIAOVU: { title: 'Trung tâm Quản lý Đào tạo', roleName: 'Giáo vụ', gradient: 'from-indigo-600 to-indigo-800', icon: LayoutDashboard },
            GIANGVIEN: { title: 'Không gian Giảng dạy', roleName: 'Giảng viên', gradient: 'from-blue-600 to-indigo-700', icon: Star },
            SINHVIEN: { title: 'Cổng thông tin Sinh viên', roleName: 'Sinh viên', gradient: 'from-indigo-500 to-blue-600', icon: UserCheck },
        };

        const config = roleConfigs[primaryRole] || roleConfigs.SINHVIEN;
        const Icon = config.icon;

        return (
            <div className={`relative overflow-hidden rounded-[3rem] bg-gradient-to-br ${config.gradient} p-12 text-white shadow-2xl shadow-indigo-100 animate-in fade-in slide-in-from-top-6 duration-700`}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <Icon size={16} className="text-indigo-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{config.roleName} Profile</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight leading-tight">
                            Xin chào, <br />
                            <span className="text-indigo-200">{user.fullName}</span>
                        </h1>
                        <p className="text-indigo-100/80 text-lg font-medium max-w-xl">
                            Chào mừng bạn trở lại với {config.title}. Hệ thống đã sẵn sàng cho ngày làm việc mới của bạn.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center min-w-[140px] shadow-lg">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Thời gian</p>
                            <p className="text-2xl font-black">20:15</p>
                            <p className="text-[10px] font-bold opacity-60">Tiết 12</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center min-w-[140px] shadow-lg">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Thông báo</p>
                            <p className="text-2xl font-black">04</p>
                            <p className="text-[10px] font-bold opacity-60">Mới</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12 pb-20">
            {renderGreetingCard()}

            <div className="space-y-12">
                {widgets.map((section, idx) => (
                    <div key={idx} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${(idx + 1) * 150}ms` }}>
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                                {section.title}
                            </h3>
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-2">
                                Xem tất cả <ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(item.path)}
                                        className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500 text-left flex flex-col gap-6 overflow-hidden"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-current/10`}>
                                            <Icon size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                                Truy cập và quản lý các tác vụ liên quan đến {item.name.toLowerCase()}.
                                            </p>
                                        </div>
                                        
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Bắt đầu ngay</span>
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>

                                        {/* Decorative Background Pattern */}
                                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                                            <Icon size={120} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
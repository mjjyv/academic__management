// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, ShieldCheck, HelpCircle, Globe, BookOpen } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authApi.login(formData);
            if (response.success) {
                setAuth(response.data.token, response.data.user);
                toast.success(`Chào mừng trở lại!`);
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc] font-sans selection:bg-blue-100">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Left Side: Minimalist Branding */}
                <div className="hidden lg:flex flex-col space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                            <BookOpen className="text-slate-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">Dong A</h2>
                            <p className="text-[9px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-1">Academic Portal</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-800">
                            Hệ thống <br />
                            <span className="text-slate-400">Điều hành Đào tạo</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-sm font-medium leading-relaxed">
                            Một cách tiếp cận tối giản và hiệu quả trong việc quản trị dữ liệu học vụ.
                        </p>
                    </div>

                    <div className="flex items-center gap-10 pt-4">
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-slate-800">25k+</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Học viên</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-slate-800">100%</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tin cậy</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Clean Login Card */}
                <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000">
                    <div className="w-full max-w-[400px] bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                                <ShieldCheck className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Đăng nhập</h3>
                            <p className="text-slate-400 text-sm font-medium mt-2">Vui lòng nhập thông tin tài khoản</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tài khoản</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-600 transition-colors" size={18} />
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        placeholder="Mã định danh"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 outline-none transition-all font-medium text-sm"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mật khẩu</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-600 transition-colors" size={18} />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 outline-none transition-all font-medium text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-200 bg-slate-50 text-slate-600 focus:ring-slate-500/10 transition-all cursor-pointer" />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Ghi nhớ</span>
                                </label>
                                <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">Quên mật khẩu?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 text-sm"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        TIẾP TỤC
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 grid grid-cols-3 gap-4">
                            <button className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-600 transition-colors">
                                <HelpCircle size={18} />
                                <span className="text-[8px] font-black uppercase tracking-tighter">Trợ giúp</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-600 transition-colors">
                                <Globe size={18} />
                                <span className="text-[8px] font-black uppercase tracking-tighter">VN/EN</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-600 transition-colors">
                                <ShieldCheck size={18} />
                                <span className="text-[8px] font-black uppercase tracking-tighter">Bảo mật</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Credits */}
            <div className="absolute bottom-8 z-10 text-slate-300 text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                <span>&copy; 2026 Dong A University</span>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <span>Minimalist Portal v2.0</span>
            </div>
        </div>
    );
};

export default LoginPage;
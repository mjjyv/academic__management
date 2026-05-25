import { useState } from 'react';
import { X, Lock, Key, AlertCircle } from 'lucide-react';
import adminApi from '../api/adminApi';
import { toast } from 'react-hot-toast';

const ResetPasswordModal = ({ isOpen, onClose, userData }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            return toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        }
        if (newPassword !== confirmPassword) {
            return toast.error('Mật khẩu xác nhận không khớp');
        }

        setLoading(true);
        try {
            const response = await adminApi.resetPassword(userData.id, newPassword);
            if (response.success) {
                toast.success(`Đã đặt lại mật khẩu cho ${userData.username}`);
                onClose();
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !userData) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-600 p-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Key size={22} /> Đặt lại mật khẩu
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {userData.fullName?.charAt(0) || userData.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{userData.fullName}</div>
                            <div className="text-sm text-blue-600">@{userData.username}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Lock size={16} className="text-gray-400" /> Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Lock size={16} className="text-gray-400" /> Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-xs text-amber-700">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>Lưu ý: Sau khi đặt lại, mật khẩu cũ sẽ bị vô hiệu hóa ngay lập tức. Hãy cung cấp mật khẩu mới này cho người dùng qua kênh an toàn.</p>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;

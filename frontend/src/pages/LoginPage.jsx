// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { authApi } from '../api/authApi';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Gọi API đăng nhập
            const response = await authApi.login(formData);

            if (response.success) {
                // Lưu token và user vào Zustand
                setAuth(response.data.token, response.data.user);
                // Chuyển hướng tới trang chính
                navigate('/dashboard');
            }
        } catch (err) {
            // Xử lý lỗi từ Backend trả về (nếu có message thì hiển thị, không thì báo lỗi chung)
            const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Hệ thống Quản lý (stdmanager)</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
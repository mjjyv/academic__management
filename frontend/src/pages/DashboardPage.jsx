// src/pages/DashboardPage.jsx
import useAuthStore from '../store/useAuthStore';

const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);

    // Logic kiểm tra vai trò
    const isRole = (roleCode) => {
        return user?.roles?.includes(roleCode);
    };

    // Trả về lời chào phù hợp
    const renderGreeting = () => {
        if (!user) return null;

        if (isRole('ADMIN')) {
            return (
                <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 mb-4">
                    <h2 className="font-bold text-lg">Trang quản trị hệ thống</h2>
                    <p>Xin chào Quản trị viên <strong>{user.fullName}</strong>. Chúc bạn một ngày làm việc hiệu quả!</p>
                </div>
            );
        }

        if (isRole('GIAOVU')) {
            return (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                    <h2 className="font-bold text-lg">Trang quản lý đào tạo</h2>
                    <p>Xin chào Giáo vụ <strong>{user.fullName}</strong>.</p>
                </div>
            );
        }

        if (isRole('GIANGVIEN')) {
            return (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                    <h2 className="font-bold text-lg">Trang quản lý giảng dạy</h2>
                    <p>Xin chào Giảng viên <strong>{user.fullName}</strong>.</p>
                </div>
            );
        }

        if (isRole('SINHVIEN')) {
            return (
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4">
                    <h2 className="font-bold text-lg">Trang thông tin sinh viên</h2>
                    <p>Xin chào Sinh viên <strong>{user.fullName}</strong>.</p>
                </div>
            );
        }

        // Default fallback
        return (
            <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 mb-4">
                <h2 className="font-bold text-lg">Hệ thống Quản lý</h2>
                <p>Xin chào <strong>{user.fullName}</strong>.</p>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {renderGreeting()}

            <div className="bg-white p-6 rounded shadow-sm">
                <h3 className="text-gray-800 font-semibold border-b pb-2 mb-4">Thông tin phiên đăng nhập</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li><strong>Tài khoản:</strong> {user?.username}</li>
                    <li><strong>Quyền hạn:</strong> {user?.roles?.join(', ')}</li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;
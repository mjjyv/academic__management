import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../api/adminApi';
import useAuthStore from '../../store/useAuthStore';
import { Plus, Search, UserCog, Key, UserMinus, Shield, RefreshCw, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import UserFormModal from '../../components/UserFormModal';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import { toast } from 'react-hot-toast';

const UserManagementPage = () => {
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        page: 0,
        size: 10
    });

    const [modalState, setModalState] = useState({
        type: null,
        isOpen: false,
        data: null
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAllUsers({
                search: filters.search,
                page: filters.page,
                size: filters.size
            });
            if (response.success) {
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchTerm, page: 0 }));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const openModal = (type, data = null) => {
        setModalState({ type, isOpen: true, data });
    };

    const closeModal = () => {
        setModalState({ type: null, isOpen: false, data: null });
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa người dùng này?')) {
            try {
                const response = await adminApi.deleteUser(userId);
                if (response.success) {
                    toast.success('Đã vô hiệu hóa người dùng');
                    fetchUsers();
                }
            } catch (error) {
                toast.error('Lỗi khi vô hiệu hóa người dùng');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <UserCog className="text-blue-600" size={28} />
                        </div>
                        Quản trị Người dùng
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 ml-1">Kiểm soát toàn diện các tài khoản và phân quyền trong hệ thống</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchUsers()}
                        className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:rotate-180 duration-500"
                        title="Làm mới"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={() => openModal('ADD')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Plus size={20} /> Thêm tài khoản
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm theo username, tên, email..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tổng cộng</span>
                            <span className="text-lg font-black text-blue-600 tracking-tighter">{users.length}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hoạt động</span>
                            <span className="text-lg font-black text-green-600 tracking-tighter">{users.filter(u => u.isActive).length}</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Người dùng</th>
                                <th className="px-8 py-5">Phân quyền</th>
                                <th className="px-8 py-5">Trạng thái</th>
                                <th className="px-8 py-5">Hoạt động cuối</th>
                                <th className="px-8 py-5 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-4"><div className="h-10 w-48 bg-gray-100 rounded-lg"></div></td>
                                        <td className="px-8 py-4"><div className="h-6 w-24 bg-gray-100 rounded-lg"></div></td>
                                        <td className="px-8 py-4"><div className="h-6 w-20 bg-gray-100 rounded-lg"></div></td>
                                        <td className="px-8 py-4"><div className="h-6 w-32 bg-gray-100 rounded-lg"></div></td>
                                        <td className="px-8 py-4"><div className="h-6 w-10 bg-gray-100 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <Search size={48} />
                                            <p className="font-bold">Không tìm thấy kết quả nào</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${u.isActive ? 'from-blue-500 to-indigo-600' : 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200`}>
                                                        {u.fullName?.charAt(0) || u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    {u.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                        {u.fullName}
                                                        {u.username === currentUser?.username && (
                                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-md font-black">BẠN</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-medium">@{u.username} • {u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {u.roles?.map(role => (
                                                    <span key={role} className="px-2 py-1 bg-white text-gray-600 rounded-lg text-[10px] font-black border border-gray-100 shadow-sm flex items-center gap-1 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                                                        <Shield size={10} /> {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                {u.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-xs text-gray-500 font-medium">
                                                {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => openModal('EDIT', u)}
                                                    disabled={u.username === currentUser?.username}
                                                    className={`p-2.5 rounded-xl transition-all ${u.username === currentUser?.username ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'}`}
                                                    title={u.username === currentUser?.username ? "Không thể tự sửa quyền của bản thân" : "Chỉnh sửa"}
                                                >
                                                    <UserCog size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => openModal('RESET_PWD', u)}
                                                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                                                    title="Đặt lại mật khẩu"
                                                >
                                                    <Key size={18} />
                                                </button>
                                                {u.username !== 'admin' && (
                                                    <button 
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        disabled={u.username === currentUser?.username}
                                                        className={`p-2.5 rounded-xl transition-all ${u.username === currentUser?.username ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                        title={u.username === currentUser?.username ? "Không thể tự vô hiệu hóa bản thân" : "Vô hiệu hóa"}
                                                    >
                                                        <UserMinus size={18} />
                                                    </button>
                                                )}
                                                <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Trang {filters.page + 1} <span className="mx-2 text-gray-200">|</span> Tổng {totalPages || 1}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 0 || loading}
                            className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:shadow-md disabled:opacity-30 transition-all active:scale-95"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page >= totalPages - 1 || loading}
                            className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:shadow-md disabled:opacity-30 transition-all active:scale-95"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            <UserFormModal
                isOpen={modalState.isOpen && (modalState.type === 'ADD' || modalState.type === 'EDIT')}
                onClose={closeModal}
                onSuccess={() => {
                    fetchUsers();
                    closeModal();
                }}
                initialData={modalState.type === 'EDIT' ? modalState.data : null}
            />

            <ResetPasswordModal
                isOpen={modalState.isOpen && modalState.type === 'RESET_PWD'}
                onClose={closeModal}
                userData={modalState.data}
            />
        </div>
    );
};

export default UserManagementPage;

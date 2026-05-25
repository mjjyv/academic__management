import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import adminApi from '../api/adminApi';
import { X, Shield, User, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserFormModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [rolesList, setRolesList] = useState([]);
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: '',
            fullName: '',
            email: '',
            phone: '',
            isActive: true,
            roles: []
        }
    });

    const isEdit = !!initialData;

    useEffect(() => {
        if (isOpen) {
            // Lấy danh sách roles để chọn
            adminApi.getAllRoles().then(res => {
                if (res.success) setRolesList(res.data);
            });

            if (isEdit) {
                setValue('username', initialData.username);
                setValue('fullName', initialData.fullName);
                setValue('email', initialData.email);
                setValue('phone', initialData.phone);
                setValue('isActive', initialData.isActive);
                setValue('roles', initialData.roles || []);
            } else {
                reset({
                    username: '',
                    password: '',
                    fullName: '',
                    email: '',
                    phone: '',
                    isActive: true,
                    roles: []
                });
            }
        }
    }, [isOpen, initialData, isEdit, setValue, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            if (isEdit) {
                // Update User (không gửi password qua API này)
                const updateData = {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    isActive: data.isActive,
                    roles: data.roles
                };
                response = await adminApi.updateUser(initialData.id, updateData);
            } else {
                // Create User
                response = await adminApi.createUser(data);
            }

            if (response.success) {
                toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm người dùng thành công');
                onSuccess();
            }
        } catch (error) {
            console.error('Lỗi khi lưu người dùng:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield size={22} /> {isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
                        </h3>
                        <p className="text-blue-100 text-xs mt-1">Cung cấp thông tin chi tiết cho người dùng hệ thống</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-gray-400" /> Tên đăng nhập
                            </label>
                            <input
                                {...register('username', { required: 'Vui lòng nhập username' })}
                                disabled={isEdit}
                                className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEdit ? 'bg-gray-50 text-gray-500' : 'focus:ring-2 focus:ring-blue-500 border-gray-200'}`}
                                placeholder="Ví dụ: admin_hieu"
                            />
                            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                        </div>

                        {/* Password (Chỉ hiện khi tạo mới) */}
                        {!isEdit && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Lock size={16} className="text-gray-400" /> Mật khẩu ban đầu
                                </label>
                                <input
                                    type="password"
                                    {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-gray-400" /> Họ và tên
                            </label>
                            <input
                                {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Nguyễn Văn A"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" /> Email
                            </label>
                            <input
                                type="email"
                                {...register('email', { required: 'Vui lòng nhập email' })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="example@domain.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" /> Số điện thoại
                            </label>
                            <input
                                {...register('phone')}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="09xxxxxxx"
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Trạng thái tài khoản
                            </label>
                            <div className="flex items-center gap-4 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value={true} {...register('isActive')} className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">Hoạt động</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value={false} {...register('isActive')} className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">Bị khóa</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Roles Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 block">Phân vai trò truy cập</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {rolesList.map(role => (
                                <label key={role.id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${watch('roles')?.includes(role.code) ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'hover:bg-gray-50 border-gray-100'}`}>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-800">{role.code}</span>
                                        <span className="text-[10px] text-gray-500">{role.name}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        value={role.code} 
                                        {...register('roles')} 
                                        className="w-4 h-4 rounded text-blue-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {loading ? 'Đang xử lý...' : isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;

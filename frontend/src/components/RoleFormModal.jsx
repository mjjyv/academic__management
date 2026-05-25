import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import adminApi from '../api/adminApi';
import { X, Shield, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RoleFormModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [groupedPermissions, setGroupedPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            code: '',
            name: '',
            description: ''
        }
    });

    const isEdit = !!initialData;

    useEffect(() => {
        if (isOpen) {
            // Lấy danh sách quyền nhóm theo module
            adminApi.getGroupedPermissions().then(res => {
                if (res.success) setGroupedPermissions(res.data);
            });

            if (isEdit) {
                setValue('code', initialData.code);
                setValue('name', initialData.name);
                setValue('description', initialData.description || '');
                setSelectedPermissions(initialData.permissions?.map(p => p.code) || []);
            } else {
                reset({ code: '', name: '', description: '' });
                setSelectedPermissions([]);
            }
        }
    }, [isOpen, initialData, isEdit, setValue, reset]);

    const togglePermission = (code) => {
        setSelectedPermissions(prev => 
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const toggleModule = (permissions) => {
        const codes = permissions.map(p => p.code);
        const allSelected = codes.every(c => selectedPermissions.includes(c));
        
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(c => !codes.includes(c)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...codes])]);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = { ...data, permissions: selectedPermissions };
            let response;
            if (isEdit) {
                response = await adminApi.updateRole(initialData.id, payload);
            } else {
                response = await adminApi.createRole(payload);
            }

            if (response.success) {
                toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm vai trò thành công');
                onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500">
                <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                            <Shield size={28} className="text-indigo-200" /> {isEdit ? `Cấu hình: ${initialData.code}` : 'Thêm vai trò mới'}
                        </h3>
                        <p className="text-indigo-100/80 text-xs mt-1 font-medium tracking-wide uppercase">Thiết lập ma trận quyền hạn cho hệ thống</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-white transition-all active:scale-90">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <form id="role-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Mã vai trò (Code)</label>
                                <input
                                    {...register('code', { required: 'Vui lòng nhập mã' })}
                                    disabled={isEdit}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                                    placeholder="Ví dụ: QUAN_LY_DAO_TAO"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Tên hiển thị</label>
                                <input
                                    {...register('name', { required: 'Vui lòng nhập tên' })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ví dụ: Quản lý Đào tạo"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Mô tả vai trò</label>
                                <textarea
                                    {...register('description')}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="2"
                                    placeholder="Mô tả chức năng của vai trò này..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h4 className="text-md font-bold text-gray-800">Danh sách quyền hạn chi tiết</h4>
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    Đã chọn {selectedPermissions.length} quyền
                                </span>
                            </div>

                            <div className="space-y-6">
                                {groupedPermissions.map(group => {
                                    const groupCodes = group.permissions.map(p => p.code);
                                    const isAllModuleSelected = groupCodes.every(c => selectedPermissions.includes(c));
                                    
                                    return (
                                        <div key={group.module} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                                                <span className="font-bold text-gray-700 text-sm">Module: {group.module}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => toggleModule(group.permissions)}
                                                    className="text-xs font-semibold text-indigo-600 hover:underline"
                                                >
                                                    {isAllModuleSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                                </button>
                                            </div>
                                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {group.permissions.map(p => (
                                                    <div 
                                                        key={p.id}
                                                        onClick={() => togglePermission(p.code)}
                                                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedPermissions.includes(p.code) ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
                                                    >
                                                        <div className="mt-0.5">
                                                            {selectedPermissions.includes(p.code) ? <CheckCircle2 size={16} className="text-indigo-600" /> : <Circle size={16} className="text-gray-300" />}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-800">{p.name}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.code}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        form="role-form"
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật vai trò' : 'Tạo vai trò mới'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleFormModal;

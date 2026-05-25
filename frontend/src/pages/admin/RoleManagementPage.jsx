import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../api/adminApi';
import { Shield, Plus, Lock, Settings, ChevronRight, Activity, Users, ShieldCheck } from 'lucide-react';
import RoleFormModal from '../../components/RoleFormModal';
import { toast } from 'react-hot-toast';

const RoleManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false,
        data: null
    });

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAllRoles();
            if (response.success) {
                setRoles(response.data);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách vai trò');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleEditRole = (role) => {
        setModalState({ isOpen: true, data: role });
    };

    const handleAddRole = () => {
        setModalState({ isOpen: true, data: null });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, data: null });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                            <ShieldCheck size={28} />
                        </div>
                        Vai trò & Quyền hạn
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 ml-1">Xây dựng ma trận quyền hạn cho các nhóm người dùng</p>
                </div>
                <button
                    onClick={handleAddRole}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    Tạo vai trò mới
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Shield size={20} /></div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">Tổng vai trò</div>
                        <div className="text-xl font-black text-gray-800">{roles.length}</div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Lock size={20} /></div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">Hệ thống</div>
                        <div className="text-xl font-black text-gray-800">{roles.filter(r => r.isSystem).length}</div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Activity size={20} /></div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">Đang kích hoạt</div>
                        <div className="text-xl font-black text-gray-800">{roles.filter(r => r.isActive).length}</div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">Nhóm người dùng</div>
                        <div className="text-xl font-black text-gray-800">{roles.length} nhóm</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-white rounded-[2rem] border border-gray-100 animate-pulse"></div>
                    ))
                ) : roles.length === 0 ? (
                    <div className="col-span-full py-32 text-center">
                        <div className="opacity-10 mb-4 flex justify-center"><ShieldCheck size={80} /></div>
                        <p className="text-gray-400 font-bold">Chưa có vai trò nào được thiết lập</p>
                    </div>
                ) : (
                    roles.map((role) => (
                        <div key={role.id} className="relative bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5 hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${role.isSystem ? 'bg-amber-400' : 'bg-indigo-500'}`}></div>
                            
                            <div className="p-8">
                                <div className="flex items-start justify-between">
                                    <div className={`p-4 rounded-2xl shadow-sm ${role.isSystem ? 'bg-amber-50 text-amber-600 shadow-amber-100' : 'bg-indigo-50 text-indigo-600 shadow-indigo-100'} transition-all group-hover:scale-110 duration-500`}>
                                        <Shield size={28} />
                                    </div>
                                    {role.isSystem && (
                                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
                                            <Lock size={12} /> System
                                        </span>
                                    )}
                                </div>
                                
                                <div className="mt-6">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{role.code}</h3>
                                    <p className="text-sm text-indigo-600 font-bold mt-1 uppercase tracking-wide">{role.name}</p>
                                    <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-2 min-h-[2.5rem] italic font-medium">
                                        "{role.description || 'Vai trò này chưa có mô tả chi tiết từ quản trị viên.'}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-5">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quyền hạn gán</div>
                                        <div className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black border border-indigo-100">
                                            {role.permissions?.length || 0} Permissions
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
                                        {role.permissions?.slice(0, 4).map(p => (
                                            <span key={p.id} className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-bold border border-gray-100">
                                                {p.code}
                                            </span>
                                        ))}
                                        {(role.permissions?.length > 4) && (
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-400 rounded-lg text-[9px] font-bold italic">
                                                +{role.permissions.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => handleEditRole(role)}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 transition-all text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-200 active:scale-95"
                                    >
                                        <Settings size={14} className="group-hover:rotate-45 transition-transform" /> 
                                        Cấu hình chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RoleFormModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onSuccess={() => {
                    fetchRoles();
                    closeModal();
                }}
                initialData={modalState.data}
            />
        </div>
    );
};

export default RoleManagementPage;

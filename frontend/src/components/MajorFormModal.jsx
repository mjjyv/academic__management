import { useState, useEffect } from 'react';
import { X, BookOpen, Save, Loader2 } from 'lucide-react';
import { majorApi } from '../api/majorApi';
import { departmentApi } from '../api/departmentApi';
import toast from 'react-hot-toast';

const MajorFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        majorCode: '',
        majorName: '',
        departmentId: '',
        description: ''
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
        if (initialData) {
            setFormData({
                majorCode: initialData.majorCode || '',
                majorName: initialData.majorName || '',
                departmentId: initialData.departmentId || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({ majorCode: '', majorName: '', departmentId: '', description: '' });
        }
    }, [initialData, isOpen]);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAllActive();
            if (res.success) setDepartments(res.data);
        } catch (error) {
            console.error("Error fetching departments", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await majorApi.update(initialData.id, formData);
            } else {
                res = await majorApi.create(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cập nhật chuyên ngành thành công" : "Thêm chuyên ngành thành công");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error("Lỗi khi lưu chuyên ngành");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <BookOpen size={20} className="text-emerald-600" />
                        {initialData ? 'Chỉnh sửa Ngành' : 'Thêm Ngành mới'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mã Ngành</label>
                            <input 
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={formData.majorCode}
                                onChange={(e) => setFormData({...formData, majorCode: e.target.value})}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Khoa quản lý</label>
                            <select 
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                            >
                                <option value="">-- Chọn Khoa --</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tên Chuyên ngành</label>
                        <input 
                            type="text"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            value={formData.majorName}
                            onChange={(e) => setFormData({...formData, majorName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mô tả</label>
                        <textarea 
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {initialData ? 'Cập nhật' : 'Lưu mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MajorFormModal;

import { useState, useEffect } from 'react';
import { X, Building2, Save, Loader2 } from 'lucide-react';
import { departmentApi } from '../api/departmentApi';
import toast from 'react-hot-toast';

const DepartmentFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', code: '', description: '', status: 'ACTIVE' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Lưu ý: Backend có thể chưa có API create cho Department trong module iii_lecturer
            // Nếu chưa có, chúng ta sẽ giả định nó tồn tại hoặc cần tạo thêm
            toast.error("Tính năng cập nhật Khoa đang được đồng bộ với module Nhân sự");
        } catch (error) {
            toast.error("Lỗi khi lưu thông tin Khoa");
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
                        <Building2 size={20} className="text-blue-600" />
                        {initialData ? 'Chỉnh sửa Khoa' : 'Thêm Khoa mới'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mã Khoa</label>
                        <input 
                            type="text"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            value={formData.code}
                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tên Khoa</label>
                        <input 
                            type="text"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
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

export default DepartmentFormModal;

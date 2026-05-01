import { useState, useEffect } from 'react';
import { X, Save, Calendar, Hash, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { semesterApi } from '../api/semesterApi';

const SemesterFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        semesterCode: '',
        semesterName: '',
        academicYear: '',
        startDate: '',
        endDate: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    semesterCode: initialData.semesterCode || '',
                    semesterName: initialData.semesterName || '',
                    academicYear: initialData.academicYear || '',
                    startDate: initialData.startDate || '',
                    endDate: initialData.endDate || '',
                    isActive: initialData.isActive ?? true
                });
            } else {
                setFormData({
                    semesterCode: '',
                    semesterName: '',
                    academicYear: '',
                    startDate: '',
                    endDate: '',
                    isActive: true
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await semesterApi.updateSemester(initialData.id, formData);
            } else {
                res = await semesterApi.createSemester(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cập nhật học kỳ thành công" : "Tạo học kỳ thành công");
                onUpdate(res.data);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi lưu học kỳ");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-fadeInScale">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-500" /> 
                        {initialData ? 'Chỉnh sửa học kỳ' : 'Thêm học kỳ mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mã học kỳ</label>
                        <div className="relative">
                            <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={formData.semesterCode}
                                onChange={(e) => setFormData({...formData, semesterCode: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                placeholder="VD: HK1_2024_2025"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tên học kỳ</label>
                        <input
                            type="text"
                            required
                            value={formData.semesterName}
                            onChange={(e) => setFormData({...formData, semesterName: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                            placeholder="VD: Học kỳ 1 năm 2024–2025"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Năm học</label>
                        <input
                            type="text"
                            required
                            value={formData.academicYear}
                            onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                            placeholder="VD: 2024-2025"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Bắt đầu</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Kết thúc</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-600 font-medium cursor-pointer">Kích hoạt học kỳ</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>Lưu lại</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SemesterFormModal;

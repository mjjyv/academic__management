import { useState, useEffect } from 'react';
import { X, GraduationCap, Save, Loader2 } from 'lucide-react';
import { trainingProgramApi } from '../api/trainingProgramApi';
import { majorApi } from '../api/majorApi';
import toast from 'react-hot-toast';

const TrainingProgramFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        programCode: '',
        programName: '',
        majorId: '',
        totalCredits: '',
        durationYears: '4'
    });
    const [majors, setMajors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMajors();
        if (initialData) {
            setFormData({
                programCode: initialData.programCode || '',
                programName: initialData.programName || '',
                majorId: initialData.majorId || '',
                totalCredits: initialData.totalCredits || '',
                durationYears: initialData.durationYears || '4'
            });
        } else {
            setFormData({ programCode: '', programName: '', majorId: '', totalCredits: '', durationYears: '4' });
        }
    }, [initialData, isOpen]);

    const fetchMajors = async () => {
        try {
            const res = await majorApi.getAll();
            if (res.success) setMajors(res.data);
        } catch (error) {
            console.error("Error fetching majors", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await trainingProgramApi.update(initialData.id, formData);
            } else {
                res = await trainingProgramApi.create(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cập nhật CTĐT thành công" : "Thêm CTĐT thành công");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error("Lỗi khi lưu chương trình đào tạo");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <GraduationCap size={20} className="text-blue-600" />
                        {initialData ? 'Chỉnh sửa CTĐT' : 'Thêm CTĐT mới'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mã Chương trình</label>
                            <input 
                                type="text"
                                required
                                placeholder="VD: TP-CNTT-2024"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={formData.programCode}
                                onChange={(e) => setFormData({...formData, programCode: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Chuyên ngành</label>
                            <select 
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                value={formData.majorId}
                                onChange={(e) => setFormData({...formData, majorId: e.target.value})}
                            >
                                <option value="">-- Chọn ngành --</option>
                                {majors.map(m => (
                                    <option key={m.id} value={m.id}>{m.majorName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tên Chương trình đào tạo</label>
                        <input 
                            type="text"
                            required
                            placeholder="VD: Kỹ thuật phần mềm - Khóa 2024"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            value={formData.programName}
                            onChange={(e) => setFormData({...formData, programName: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tổng tín chỉ</label>
                            <input 
                                type="number"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={formData.totalCredits}
                                onChange={(e) => setFormData({...formData, totalCredits: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Thời gian (Năm)</label>
                            <input 
                                type="number"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={formData.durationYears}
                                onChange={(e) => setFormData({...formData, durationYears: e.target.value})}
                            />
                        </div>
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

export default TrainingProgramFormModal;

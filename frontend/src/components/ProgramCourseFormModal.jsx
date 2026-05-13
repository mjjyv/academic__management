import { useState, useEffect } from 'react';
import { X, Book, Save, Loader2 } from 'lucide-react';
import { trainingProgramCourseApi } from '../api/trainingProgramCourseApi';
import { courseApi } from '../api/courseApi';
import toast from 'react-hot-toast';

const ProgramCourseFormModal = ({ isOpen, onClose, programId, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        trainingProgramId: programId,
        courseId: '',
        semester: 1,
        year: 1,
        isRequired: true,
        note: ''
    });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
        if (initialData) {
            setFormData({
                trainingProgramId: programId,
                courseId: initialData.courseId || '',
                semester: initialData.semester || 1,
                year: initialData.year || 1,
                isRequired: initialData.isRequired ?? true,
                note: initialData.note || ''
            });
        } else {
            setFormData({
                trainingProgramId: programId,
                courseId: '',
                semester: 1,
                year: 1,
                isRequired: true,
                note: ''
            });
        }
    }, [initialData, isOpen, programId]);

    const fetchCourses = async () => {
        try {
            const res = await courseApi.getAllCourses();
            if (res.success) setCourses(res.data);
        } catch (error) {
            console.error("Error fetching courses", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await trainingProgramCourseApi.updateProgramCourse(initialData.id, formData);
            } else {
                res = await trainingProgramCourseApi.addCourseToProgram(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cập nhật môn học thành công" : "Thêm môn học vào khung thành công");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error("Lỗi khi lưu môn học vào khung");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <Book size={20} className="text-blue-600" />
                        {initialData ? 'Chỉnh sửa môn trong khung' : 'Thêm môn vào khung'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Chọn môn học</label>
                        <select 
                            required
                            disabled={!!initialData}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm disabled:opacity-50"
                            value={formData.courseId}
                            onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                        >
                            <option value="">-- Chọn môn học --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.courseName} ({c.courseCode})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Học kỳ</label>
                            <input 
                                type="number"
                                min="1"
                                max="10"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={formData.semester}
                                onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Năm học</label>
                            <input 
                                type="number"
                                min="1"
                                max="5"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <input 
                            type="checkbox"
                            id="isRequired"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            checked={formData.isRequired}
                            onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
                        />
                        <label htmlFor="isRequired" className="text-sm font-bold text-gray-700 cursor-pointer">Môn học bắt buộc</label>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ghi chú</label>
                        <textarea 
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
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

export default ProgramCourseFormModal;

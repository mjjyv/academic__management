import { useState, useEffect } from 'react';
import { X, Save, Book, Hash, Tag, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { courseApi } from '../api/courseApi';
import { departmentApi } from '../api/departmentApi';

const CourseFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        courseNameEn: '',
        credits: 0,
        courseType: 'CoSoNganh',
        theoryHours: 0,
        practiceHours: 0,
        selfStudyHours: 0,
        departmentId: ''
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
            if (initialData) {
                setFormData({
                    courseCode: initialData.courseCode || '',
                    courseName: initialData.courseName || '',
                    courseNameEn: initialData.courseNameEn || '',
                    credits: initialData.credits || 0,
                    courseType: initialData.courseType || 'CoSoNganh',
                    theoryHours: initialData.theoryHours || 0,
                    practiceHours: initialData.practiceHours || 0,
                    selfStudyHours: initialData.selfStudyHours || 0,
                    departmentId: initialData.departmentId || ''
                });
            } else {
                setFormData({
                    courseCode: '',
                    courseName: '',
                    courseNameEn: '',
                    credits: 0,
                    courseType: 'CoSoNganh',
                    theoryHours: 0,
                    practiceHours: 0,
                    selfStudyHours: 0,
                    departmentId: ''
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAllActive();
            if (res.success) setDepartments(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khoa:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await courseApi.updateCourse(initialData.id, formData);
            } else {
                res = await courseApi.createCourse(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cập nhật môn học thành công" : "Tạo môn học thành công");
                onUpdate(res.data);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi lưu môn học");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-fadeInScale">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Book size={20} className="text-blue-500" /> 
                        {initialData ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột 1 */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mã môn học</label>
                                <div className="relative">
                                    <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.courseCode}
                                        onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        placeholder="VD: IT101"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tên môn học (Tiếng Việt)</label>
                                <div className="relative">
                                    <Book size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.courseName}
                                        onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        placeholder="Nhập tên môn học"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tên môn học (Tiếng Anh)</label>
                                <input
                                    type="text"
                                    value={formData.courseNameEn}
                                    onChange={(e) => setFormData({...formData, courseNameEn: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                    placeholder="English name"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Khoa phụ trách</label>
                                <select
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="">-- Chọn khoa --</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Cột 2 */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Số tín chỉ</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        required
                                        value={formData.credits}
                                        onChange={(e) => setFormData({...formData, credits: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Loại môn học</label>
                                    <select
                                        value={formData.courseType}
                                        onChange={(e) => setFormData({...formData, courseType: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                    >
                                        <option value="CoSoNganh">Cơ sở ngành</option>
                                        <option value="ChuyenNganh">Chuyên ngành</option>
                                        <option value="DaiCuong">Đại cương</option>
                                        <option value="TuChon">Tự chọn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 text-center block">Lý thuyết</label>
                                    <input
                                        type="number"
                                        value={formData.theoryHours}
                                        onChange={(e) => setFormData({...formData, theoryHours: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-center"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 text-center block">Thực hành</label>
                                    <input
                                        type="number"
                                        value={formData.practiceHours}
                                        onChange={(e) => setFormData({...formData, practiceHours: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-center"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 text-center block">Tự học</label>
                                    <input
                                        type="number"
                                        value={formData.selfStudyHours}
                                        onChange={(e) => setFormData({...formData, selfStudyHours: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-center"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mô tả tóm tắt</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                                    placeholder="Nội dung tóm tắt môn học..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
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
                            <span>{initialData ? 'Lưu thay đổi' : 'Tạo môn học'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseFormModal;

import { useState, useEffect } from 'react';
import { X, Save, Book, Users, MapPin, Calendar, Hash, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { semesterApi } from '../api/semesterApi';
import { courseApi } from '../api/courseApi';
import { lecturerApi } from '../api/lecturerApi';

const SectionFormModal = ({ isOpen, onClose, semesterId, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        classCode: '',
        courseId: '',
        semesterId: semesterId || '',
        lecturerId: '',
        roomId: '',
        buildingId: '',
        maxStudents: 40,
        minStudents: 10,
        classType: 'theory',
        status: 'open',
        note: ''
    });

    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDependencies();
            if (initialData) {
                setFormData({
                    ...initialData,
                    semesterId: semesterId
                });
            } else {
                setFormData({
                    classCode: '',
                    courseId: '',
                    semesterId: semesterId,
                    lecturerId: '',
                    roomId: '',
                    buildingId: '',
                    maxStudents: 40,
                    minStudents: 10,
                    classType: 'theory',
                    status: 'open',
                    note: ''
                });
            }
        }
    }, [isOpen, initialData, semesterId]);

    const fetchDependencies = async () => {
        setLoadingData(true);
        try {
            const [courseRes, lecturerRes] = await Promise.all([
                courseApi.getAllCourses(),
                lecturerApi.getAllLecturers()
            ]);
            if (courseRes.success) setCourses(courseRes.data);
            if (lecturerRes.success) setLecturers(lecturerRes.data.content || []);
        } catch (error) {
            console.error("Error fetching dependencies", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await semesterApi.updateSection(initialData.id, formData);
            } else {
                res = await semesterApi.createSection(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cập nhật lớp thành công" : "Tạo lớp học phần thành công");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi lưu lớp học phần");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-fadeInScale">
                <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Book size={22} className="text-blue-500" />
                            {initialData ? 'Chỉnh sửa lớp học phần' : 'Mở lớp học phần mới'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Thiết lập thông tin đào tạo cho học kỳ</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột trái */}
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mã lớp học phần</label>
                                <div className="relative">
                                    <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.classCode}
                                        onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium"
                                        placeholder="VD: INT3305.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Môn học</label>
                                <select
                                    required
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="">-- Chọn môn học --</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Giảng viên phụ trách</label>
                                <select
                                    value={formData.lecturerId}
                                    onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="">-- Chưa phân công --</option>
                                    {lecturers.map(l => (
                                        <option key={l.id} value={l.id}>{l.fullName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tối đa (SV)</label>
                                    <input
                                        type="number"
                                        value={formData.maxStudents}
                                        onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Loại lớp</label>
                                    <select
                                        value={formData.classType}
                                        onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                                    >
                                        <option value="theory">Lý thuyết</option>
                                        <option value="lab">Thực hành</option>
                                        <option value="hybrid">Hỗn hợp</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải */}
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Địa điểm (Phòng & Tòa)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.roomId}
                                            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                            className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                                            placeholder="Phòng"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.buildingId}
                                        onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                                        placeholder="Tòa nhà"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Trạng thái lớp</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                                >
                                    <option value="planned">Lên kế hoạch</option>
                                    <option value="open">Đang mở</option>
                                    <option value="closed">Đã đóng</option>
                                    <option value="canceled">Đã hủy</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Ghi chú</label>
                                <textarea
                                    rows="4"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none resize-none"
                                    placeholder="Yêu cầu đặc biệt..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>Lưu thông tin lớp học</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SectionFormModal;

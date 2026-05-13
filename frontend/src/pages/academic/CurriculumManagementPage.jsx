import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Book, CheckCircle2, AlertCircle, Clock, Hash, Layout, Loader2 } from 'lucide-react';
import { trainingProgramApi } from '../../api/trainingProgramApi';
import { trainingProgramCourseApi } from '../../api/trainingProgramCourseApi';
import ProgramCourseFormModal from '../../components/ProgramCourseFormModal';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const CurriculumManagementPage = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useAuthStore(state => state.user);
    const canManage = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    // Modal and View states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeYear, setActiveYear] = useState('1');

    useEffect(() => {
        fetchData();
    }, [programId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [progRes, currRes] = await Promise.all([
                trainingProgramApi.getById(programId),
                trainingProgramCourseApi.getCoursesByProgram(programId)
            ]);

            if (progRes.success) setProgram(progRes.data);
            if (currRes.success) setCurriculum(currRes.data);
        } catch (error) {
            toast.error("Không thể tải thông tin khung chương trình");
        } finally {
            setLoading(false);
        }
    };

    // Group curriculum by year and semester
    const groupedCurriculum = curriculum.reduce((acc, course) => {
        const year = course.year || 1;
        const semester = course.semester || 1;
        if (!acc[year]) acc[year] = {};
        if (!acc[year][semester]) acc[year][semester] = [];
        acc[year][semester].push(course);
        return acc;
    }, {});

    const years = Object.keys(groupedCurriculum).sort((a, b) => a - b);

    useEffect(() => {
        if (years.length > 0 && !years.includes(activeYear)) {
            setActiveYear(years[0]);
        }
    }, [years]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa môn học này khỏi chương trình?")) {
            try {
                const res = await trainingProgramCourseApi.removeCourseFromProgram(id);
                if (res.success) {
                    toast.success("Xóa môn học thành công");
                    fetchData();
                }
            } catch (error) {
                toast.error("Lỗi khi xóa môn học");
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Đang tải khung chương trình...</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/academic-hierarchy')}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-wider">
                                {program?.programCode}
                            </span>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Khung chương trình</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight">{program?.programName}</h1>
                    </div>
                </div>
                {canManage && (
                    <button 
                        onClick={() => {
                            setSelectedCourse(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all"
                    >
                        <Plus size={20} />
                        Thêm môn học vào khung
                    </button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Tổng tín chỉ', value: program?.totalCredits || 0, icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Số môn học', value: curriculum.length, icon: Book, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Hệ đào tạo', value: program?.educationType || 'Chính quy', icon: Layout, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Môn bắt buộc', value: curriculum.filter(c => c.isRequired).length, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Year Tabs */}
            {years.length > 0 && (
                <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit mb-8">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => setActiveYear(year)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                                activeYear === year 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Năm học {year}
                        </button>
                    ))}
                </div>
            )}

            {/* Curriculum Table for selected Year */}
            <div className="space-y-8">
                {years.includes(activeYear) && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-6 py-4 bg-gray-900 flex justify-between items-center text-white">
                            <h2 className="text-lg font-black uppercase tracking-widest">Chi tiết Năm học thứ {activeYear}</h2>
                            <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-lg">
                                {Object.values(groupedCurriculum[activeYear]).flat().reduce((sum, c) => sum + (c.credits || 0), 0)} Tín chỉ
                            </div>
                        </div>

                        {Object.keys(groupedCurriculum[activeYear]).sort((a, b) => a - b).map((sem) => (
                            <div key={sem} className="border-b border-gray-100 last:border-0">
                                <div className="bg-gray-50/80 px-6 py-3 flex justify-between items-center border-b border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                        Học kỳ {sem}
                                    </h3>
                                    <span className="text-xs font-bold text-gray-500">
                                        {groupedCurriculum[activeYear][sem].reduce((sum, c) => sum + (c.credits || 0), 0)} TC
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-6 py-4 w-24">Mã môn</th>
                                                <th className="px-6 py-4">Tên môn học</th>
                                                <th className="px-6 py-4 w-24 text-center">Tín chỉ</th>
                                                <th className="px-6 py-4 w-32">Loại môn</th>
                                                <th className="px-6 py-4">Tiên quyết</th>
                                                {canManage && <th className="px-6 py-4 w-24 text-right">Thao tác</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {groupedCurriculum[activeYear][sem].map((course) => (
                                                <tr key={course.id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-black text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md uppercase">
                                                            {course.courseCode}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {course.courseName}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-bold text-gray-700">{course.credits}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                                            course.isRequired ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                        }`}>
                                                            {course.isRequired ? 'Bắt buộc' : 'Tự chọn'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {course.prerequisiteCourseName ? (
                                                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 w-fit px-2.5 py-1 rounded-lg">
                                                                <AlertCircle size={12} />
                                                                {course.prerequisiteCourseName}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    {canManage && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button 
                                                                    onClick={() => {
                                                                        setSelectedCourse(course);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                    className="p-2 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(course.id)}
                                                                    className="p-2 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                                                                    title="Xóa môn học"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {years.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-300 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Book size={64} className="opacity-10 mb-4" />
                        <p className="font-bold uppercase tracking-widest text-sm">Chưa có môn học nào</p>
                        <p className="text-xs mt-1">Hãy bắt đầu xây dựng khung chương trình bằng cách thêm môn học</p>
                    </div>
                )}
            </div>

            <ProgramCourseFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                programId={programId}
                initialData={selectedCourse}
                onUpdate={fetchData}
            />
        </div>
    );
};

export default CurriculumManagementPage;
